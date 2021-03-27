<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class PaypalRestApiController extends Controller
{
    public function restApiCheckout(Request $request)
    {
        $order = Order::find($request->orderID);
        \PayPal::setProvider();
        $paypalProvider = \PayPal::getProvider();
        $paypalProvider->setApiCredentials(config('paypal'));
        $access_token = $paypalProvider->getAccessToken();
        $paypalProvider->setAccessToken($access_token);

        $purchase_units = $this->preparePurchaseUnits($order);

        try {
            $paypalOrder = $paypalProvider->createOrder($purchase_units);
            $paypalOrderId = $paypalOrder['id'];
            $paypalOrderStatus = $paypalOrder['status'];

            return response()->json(['id' => $paypalOrderId, 'status' => $paypalOrderStatus], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Error processing order ' . $order->id, 'order' => $order]);
        }
    }

    public function preparePurchaseUnits($order)
    {
        $totalToPay = $order->balance ?? $order->total; // if payment == paypal, $order->balance == 0;

        $purchase_units = array(
            'intent' => 'CAPTURE',
            'purchase_units' =>
            array(
                0 =>
                array(
                    'reference_id' => $order->id,
                    'description' => 'Bebidas',
                    'custom_id' => 'Vinoreomx',
                    'amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => $totalToPay,
                        'breakdown' =>
                        array(
                            'item_total' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => $totalToPay,
                            ),
                            'shipping' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => 99,
                            ),
                            'shipping_discount' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => 99,
                            )
                        ),
                    ),
                    'items' => $this->getItemUnits($order),
                    'shipping' =>
                    array(
                        'method' => 'Vinoreo',
                        'name' =>
                        array(
                            'full_name' => $order->order_name
                        ),
                        'address' =>
                        array(
                            'address_line_1' => $order->address,
                            'address_line_2' => $order->address_details ?? '',
                            'admin_area_2' => $order->neighborhood,
                            'admin_area_1' => 'JAL',
                            'postal_code' => $order->cp,
                            'country_code' => 'MX',
                        ),
                    ),
                ),
            )
        );

        return $purchase_units;
    }

    public function getItemUnits($order)
    {

        $cart = \Cart::getContent();
        $paymentMode = $order->payment_mode;

        if ($paymentMode == "paypal") {
            $cartItems = array_map(function ($item) {
                return array(
                    'name' => $item['name'],
                    'sku' => $item['id'],
                    'unit_amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => $item['price'],
                    ),
                    'quantity' => $item['quantity'],
                );
            }, $cart->toArray(), []); // adding a second array will make index keys display correctly... lol
        } else {
            // if payment on_delivery only charge 7% and change item name
            $cartItems = array_map(function ($item) {
                return array(
                    'name' => 'Anticipo ' . $item['name'],
                    'sku' => $item['id'],
                    'unit_amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => ceil($item['price'] - ($item['price'] / 1.07)),
                    ),
                    'quantity' => $item['quantity'],
                );
            }, $cart->toArray(), []);
        }


        return $cartItems;
    }
}
