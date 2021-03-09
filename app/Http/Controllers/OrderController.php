<?php

namespace App\Http\Controllers;

use App\Mail\AdminOrderConfirmationEmail;
use App\Mail\TransferOrderConfirmation;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
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

    public function prepareConfirmationEmails($user, $order, $products, $grandTotal, $cartTotal,$balanceToPay)
    {
        // to user
        Mail::to($user->email)->send(new TransferOrderConfirmation(
            $order,
            $products,
            $grandTotal,
            $cartTotal,
            $balanceToPay,
        ));

        // to admin
        $adminEmails = [
            'vinoreomx@gmail.com',
            'ventas@vinosdivisa.com',
            'spalafox@vinosdivisa.com',
            'jrodriguez@vinosdivisa.com',
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
