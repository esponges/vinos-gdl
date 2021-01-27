<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Srmklive\PayPal\Services\ExpressCheckout;

class PaypalController extends Controller
{
    public function checkout($orderId)
    {
        $this->provider = new ExpressCheckout();
        $cart = $this->getCheckoutData($orderId);

        try {
            $response = $this->provider->setExpressCheckout($cart, false);
            // dd($response);

            return redirect($response['paypal_link']);
        } catch (\Exception $e) {
            $invoice = $this->createInvoice($cart, 'Invalid');
            dd($invoice);

            session()->put(['code' => 'danger', 'message' => "Error processing PayPal payment for Order $invoice->id!"]);
        }
    }

    public function getCheckoutData($orderId)
    {
        $cart = \Cart::getContent();

        $cartItems = array_map(function ($item) {
            return [
                'name' => $item['name'],
                'price' => $item['price'],
                'qty' => $item['quantity']
            ];
        }, $cart->toArray());

        // dd($cartItems);

        $checkoutData = [
            'items' => $cartItems,
            'return_url' => route('paypal.success', $orderId),
            'cancel_url' => route('paypal.fail', $orderId),
            'invoice_id' => $orderId,
            'invoice_description' => "Recibo de orden # $orderId ",
            'total' => \Cart::getTotal()
        ];

        return $checkoutData;
    }

    public function getExpressCheckoutSuccess(Request $request, $orderId)
    {
        $token = $request->get('token');
        $PayerID = $request->get('PayerID');
        $checkoutData = $this->getCheckoutData($orderId);

        $this->provider = new ExpressCheckout();
        $response = $this->provider->getExpressCheckoutDetails($token);

        if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) {

            $payment_status = $this->provider->doExpressCheckoutPayment($checkoutData, $token, $PayerID);
            $status = $payment_status['PAYMENTINFO_0_PAYMENTSTATUS'];

            if (in_array($status, ['Completed', 'Processed'])) {
                $order = Order::find($orderId);
                $order->is_paid = 1;
                $order->save();

                // order content info
                $products = \Cart::getContent();
                $grandTotal = \Cart::getTotal();
                $user = auth()->user()->name;

                //send success email

                \Cart::clear();

                // dd($products, $grandTotal, $order);

                return view('order.success', compact('order', 'products', 'grandTotal', 'user'));
            };
        }
        dd('oh no, something went wrong!!!');
    }

    public function paypalFail($orderId)
    {
        dd('Sorry we couln\'t verifiy your payment :', Order::find($orderId));
    }
}
