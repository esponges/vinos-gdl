<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\TransferOrderConfirmation;
use App\Mail\AdminOrderConfirmationEmail;
use GuzzleHttp\Exception\BadResponseException;

class OrderController extends Controller
{
    public function paypalApiOrder(Request $request)
    {
        if (Auth::user()) {
            $order = new Order();
            $order->total = \Cart::getTotal();
            $order->total_items = \Cart::getTotalQuantity();
            $order->user_id = Auth::user()->id;
            $order->order_name = $request->order_name;
            $order->payment_mode = $request->payment_mode;
            $order->address = $request->address;
            $order->address_details = $request->address_details;
            $order->delivery_day = $request->delivery_day;
            $order->delivery_schedule = $request->delivery_schedule;
            $order->phone = $request->phone;
            $order->cp = $request->cp;
            $order->neighborhood = $request->neighborhood;
            $order->balance = $request->balance;

            $order->save();

            $cartItems = \Cart::getContent();

            foreach ($cartItems as $item) {
                DB::table('order_items')->insert([
                    'product_id' => $item->id,
                    'unit_price' => $item->price,
                    'order_id' => $order->id,
                    'qty' => $item->quantity,
                ]);
            }

            if ($order->payment_mode === 'transfer' || $order->payment_mode === 'full_MP') {
                $products = \Cart::getContent();
                $paidWithPayPal = $order->balance;
                $grandTotal = \Cart::getTotal();
                $balanceToPay = $grandTotal - $paidWithPayPal;
                $user = auth()->user();
                $paymentType = $order->payment_mode;

                $emailController = new EmailController();
                $emailController->prepareConfirmationEmails($order, $products, $paidWithPayPal, $grandTotal, $balanceToPay, $user, $paymentType);

                return response()->json(['status' => 'Transfer Order Created', 'orderID' => $order->id, 'paymentType' => $paymentType]);
            }

            return response()->json(['status' => 'CREATED', 'orderID' => $order->id], 200);
        }
        return response()->json('session timed out', 408);
    }

    public function getOrderInfo(Request $request)
    {
        $orderID = $request->vinoreoOrderID;

        try {
            $cartItems = $this->getOrderItems($orderID);
            $order = Order::find($orderID)->toArray();

            return response()->json(['order' => $order, 'cartItems' => $cartItems], 200);
        } catch (BadResponseException $ex) {

            return response()->json([['exception' => $ex]]);
        }
    }

    public function prepareConfirmationEmails($user, $order, $products, $grandTotal, $cartTotal,$balanceToPay)
    {
        // to user
        Mail::to($user->email)->send(new TransferOrderConfirmation(
            $order,
            $products,
            $grandTotal,
            $balanceToPay,
        ));

        // to admin
        $adminEmails = [
            'vinoreomx@gmail.com',
            'ventas@vinosdivisa.com',
            'ventas2@vinosdivisa.com',
            'jrodriguez@vinosdivisa.com',
        ];

        foreach ($adminEmails as $email) {
            Mail::to($email)->send(new AdminOrderConfirmationEmail(
                $order,
                $products,
                $grandTotal,
                $cartTotal, // === $paidWithPayPal
                $balanceToPay
            ));
        }
    }

    public function getOrderItems($orderID)
    {
        $orderItems = DB::table('order_items')->where('order_id', $orderID)->get();

        $cartItems = array_map(
            function ($item) {
                return array(
                    'name' => Product::where('id', $item->product_id)->first()->name,
                    'price' => $item->unit_price,
                    'quantity' => $item->qty,
                );
            },
            $orderItems->toArray()
        );

        return $cartItems;
    }

    /* V1 PAYPAL PAYMENT METHODS */

    public function create(Request $request)
    {
        if (Auth::user()) {
            $order = new Order();
            $order->total = \Cart::getTotal();
            $order->total_items = \Cart::getTotalQuantity();
            $order->user_id = Auth::user()->id;
            $order->order_name = $request->order_name;
            $order->payment_mode = $request->payment_mode;
            $order->address = $request->address;
            $order->address_details = $request->address_details;
            $order->delivery_day = $request->delivery_day;
            $order->delivery_schedule = $request->delivery_schedule;
            $order->phone = $request->phone;
            $order->cp = $request->cp;
            $order->neighborhood = $request->neighborhood;

            $order->save();

            $cartItems = \Cart::getContent();

            foreach ($cartItems as $item) {
                DB::table('order_items')->insert([
                    'product_id' => $item->id,
                    'unit_price' => $item->price,
                    'order_id' => $order->id,
                    'qty' => $item->quantity,
                ]);
            }

            if ($order->payment_mode == "transfer") {
                // return $this->transferPaymentMode($order);
                return redirect()->route('paypal.transfer', $order->id);
            };

            return redirect()->route('paypal.checkout', [$order->id, $order->payment_mode]);
        }
        return response()->json('session timed out', 408);
    }

    public function transferPaymentMode($orderId)
    {
        // prepare content
        $order = Order::find($orderId);
        $products = \Cart::getContent();
        $grandTotal = \Cart::getTotal();
        $cartTotal = 0;
        $balanceToPay = $grandTotal - $cartTotal;
        $user = auth()->user();

        \Cart::clear();

        //send email
        $this->prepareConfirmationEmails($user, $order, $products, $grandTotal, $cartTotal, $balanceToPay);

        return view('order.success', compact('order', 'orderId', 'products', 'grandTotal', 'cartTotal', 'balanceToPay'));
    }

    public function orderSuccess(Request $request, $orderId, $cartTotal)
    {
        $order = Order::find($orderId);
        $products = \Cart::getContent();
        $grandTotal = \Cart::getTotal();
        $balanceToPay = $grandTotal - $cartTotal;

        \Cart::clear();

        return view('order.paypalSuccess', compact('order', 'products', 'grandTotal', 'balanceToPay', 'cartTotal'));
    }
}
