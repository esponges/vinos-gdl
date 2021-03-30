<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminOrderConfirmationEmail;
use App\Mail\PayPalError;
use Srmklive\PayPal\Services\ExpressCheckout;

class PaypalController extends Controller
{
    public function checkout($orderId, $paymentMode)
    {
        $this->provider = new ExpressCheckout();
        $cart = $this->getCheckoutData($orderId, $paymentMode);

        try {
            $response = $this->provider->setExpressCheckout($cart, false);

            return redirect($response['paypal_link']);
        } catch (\Exception $e) {
            $invoice = $this->createInvoice($cart, 'Invalid');

            session()->put(['code' => 'danger', 'message' => "Error processing PayPal payment for Order $invoice->id!"]);
        }
    }

    public function getCheckoutData($orderId, $paymentMode = null)
    {
        $cart = \Cart::getContent();

        if ($paymentMode == "paypal") {
            $cartItems = array_map(function ($item) {
                return [
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'qty' => $item['quantity']
                ];
            }, $cart->toArray());
        } else {
            // if payment on_delivery only charge 7% and change item name
            $cartItems = array_map(function ($item) {
                return [
                    'name' => "anticipo " . $item['name'],
                    'price' => ceil($item['price'] - ($item['price'] / 1.07)),
                    'qty' => $item['quantity']
                ];
            }, $cart->toArray());
        }
        $cartTotal = 0;
        foreach ($cartItems as $item) {
            $cartTotal += $item['price'] * $item['qty'];
        }
        // dd($cartTotal, \Cart::getTotal() * 0.07);
        // dd($cartItems, $cartTotal);

        $checkoutData = [
            'items' => $cartItems,
            'return_url' => route('paypal.success', [$orderId, $paymentMode, $cartTotal]),
            'cancel_url' => route('paypal.fail', [$orderId, 'cancel_url from getCheckoutData', 'cancel_url']),
            'invoice_id' => uniqid() . "-" .  $orderId,
            'invoice_description' => "Recibo de orden # $orderId ",
            'total' => $cartTotal
        ];

        return $checkoutData;
    }

    public function getExpressCheckoutSuccess(Request $request, $orderId, $paymentMode, $cartTotal)
    {
        $token = $request->get('token');
        $PayerID = $request->get('PayerID');
        $checkoutData = $this->getCheckoutData($orderId, $paymentMode);

        $this->provider = new ExpressCheckout();
        $response = $this->provider->getExpressCheckoutDetails($token); // no charge to user yet, only authorizations

        if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) {

            // proceed to charge the user with doExpressCheckoutPayment
            $payment_status = $this->provider->doExpressCheckoutPayment($checkoutData, $token, $PayerID);

            if ($payment_status['PAYMENTINFO_0_PAYMENTSTATUS']) {

                $status = $payment_status['PAYMENTINFO_0_PAYMENTSTATUS'];

                if (in_array($status, ['Completed', 'Processed', 'Completed_Funds_Held'])) {
                    $order = Order::find($orderId);
                    $order->is_paid = 1;
                    $order->save();
                    $products = \Cart::getContent();
                    $grandTotal = \Cart::getTotal();
                    $balanceToPay = $grandTotal - $cartTotal; // if (100% paypal) &&  0
                    $user = auth()->user();

                    // send success email
                    $this->preparePaypalConfirmationEmails($order, $products, $cartTotal, $grandTotal, $balanceToPay, $user);

                    return redirect()->route('order.success', [$order->id, $cartTotal]);
                    // return view('order.success', compact('order', 'products', 'grandTotal', 'balanceToPay', 'cartTotal', 'user', 'orderId'));
                }
                return redirect()->route('paypal.fail', [$orderId, 'Missing status: Completed, Processed, or Completed_Funds_Held', 'missing_status']);
            }
            return redirect()->route('paypal.fail', [$orderId, 'PAYMENTINFO_0_PAYMENTSTATUS === false', 'payment_status']);
        }
        return redirect()->route('paypal.fail', [$orderId, 'Missing: SUCCESS , SUCCESSWITHWARNING', 'missing_success']);
    }

    public function preparePaypalConfirmationEmails($order, $products, $cartTotal, $grandTotal, $balanceToPay, $user)
    {
        // customer email
        Mail::to($user->email)->send(new ConfirmationEmail(
            $cartTotal,
            $products,
            $grandTotal,
            $balanceToPay,
            $order,
        ));

        // staff email
        $adminEmails = [
            'vinoreomx@gmail.com',
            'ventas@vinosdivisa.com',
            'spalafox@vinosdivisa.com',
            'jrodriguez@vinosdivisa.com',
            'blancacarretero@vinosdivisa.com',
        ];

        foreach ($adminEmails as $email) {
            Mail::to($email)->send(new AdminOrderConfirmationEmail(
                $order,
                $products,
                $grandTotal,
                $cartTotal,
                $balanceToPay
            ));
        }
    }

    public function paypalFail($orderId, $error, $errorHeader)
    {
        // dd('Sorry we couln\'t verifiy your payment :', Order::find($orderId));
        $order = Order::find($orderId);
        $email = 'vinoreomx@gmail.com';

        Mail::to($email)->send(new PayPalError($order, $error));

        if ( $errorHeader === 'missing_status' || $errorHeader === 'payment_status') {
            \Cart::clear();
            return view('order.failButCharged', ['order' => $order]);
        }
        return view('order.fail', ['order' => $order]);

    }
}
