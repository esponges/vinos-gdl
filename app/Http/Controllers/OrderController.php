<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        if (Auth::user()) {
            $order = new Order();
            $order->total = \Cart::getTotal();
            $order->total_items = \Cart::getTotalQuantity();
            $order->user_id = Auth::user()->id;
            $order->payment_mode = $request->payment_mode;
            $order->address = $request->address;
            $order->address_details = $request->address_details;

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

            if ($request->payment_mode == 'paypal') {
                return redirect()->route('paypal.checkout', $order->id);
            }
        }
        return response()->json('session timed out', 408);
    }
}
