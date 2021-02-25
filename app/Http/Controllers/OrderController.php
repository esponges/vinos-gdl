<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmationEmail;
use Faker\Factory;
use App\Models\User;
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

            foreach ($cartItems as $item ) {
                DB::table('order_items')->insert([
                    'product_id' => $item->id,
                    'unit_price' => $item->price,
                    'order_id' => $order->id,
                    'qty' => $item->quantity,
                ]);
            }

            return redirect()->route('paypal.checkout', [$order->id, $order->payment_mode]);

        }
        return response()->json('session timed out', 408);
    }

    // testing purposes
    public function sendConfirmationEmail()
    {
        $cart = \Cart::getContent();
        $products = array_map(function ($item) {
            return [
                'name' => "anticipo " . $item['name'],
                'price' => $item['price'] * 0.07,
                'qty' => $item['quantity']
            ];
        }, $cart->toArray());

        $cartTotal = \Cart::getTotal() * 0.07;
        $grandTotal = \Cart::getTotal();
        $balanceToPay = $grandTotal - $cartTotal;
        $order = Factory::create()->numberBetween(1000, 2000);
        $user = User::first();

        Mail::to($user->email)->send(new ConfirmationEmail(
            $cartTotal,
            $products,
            $grandTotal,
            $balanceToPay,
            $order,
            $user
        ));
    }
}
