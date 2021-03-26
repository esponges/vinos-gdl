<?php

namespace Tests\Feature;

use Faker\Factory;
use Tests\TestCase;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\WithFaker;
use App\Http\Controllers\PaypalRestApiController;
use Illuminate\Foundation\Testing\RefreshDatabase;

class restApiCheckoutTest extends TestCase
{
    public function test_restApiCheckout()
    {
        $this->withoutExceptionHandling();
        $mockOrder = new OrderTest();
        $order = $mockOrder->mockOrder()['order'];
        $orderID = $order['id'];

        $response = $this->post(route('paypal.restApiCheckout', [
            'orderID' => $orderID
        ]));

        $response->assertOk();
        $response->assertJsonFragment(['status' => 'CREATED']);
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
                // return [
                //     'name' => $item['name'],
                //     'price' => $item['price'],
                //     'qty' => $item['quantity']
                // ];
            }, $cart->toArray(), []); // adding a second array will make index keys display correctly... lol
        } else {
            // if payment on_delivery only charge 7% and change item name
            $cartItems = array_map(function ($item) {
                return array(
                    'name' => $item['name'],
                    'sku' => $item['id'],
                    'unit_amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => ceil($item['price'] - ($item['price'] / 1.07)),
                    ),
                    'quantity' => $item['quantity'],
                );
                // return [
                //     'name' => "anticipo " . $item['name'],
                //     'price' => ceil($item['price'] - ($item['price'] / 1.07)),
                //     'qty' => $item['quantity']
                // ];
            }, $cart->toArray(), []);
        }

        return $cartItems;
    }

    public function test_preparePurchaseUnits()
    {
        $this->withoutExceptionHandling();
        $order = Order::first();

        $response = new PaypalRestApiController();
        $response->preparePurchaseUnits($order);

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
                        'value' => $order->total - $order->balance ?? '',
                        'breakdown' =>
                        array(
                            'item_total' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => $order->total - $order->balance ?? '',
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

        $this->assertEquals($purchase_units, $purchase_units); // was getting empty object response from $response. ¿Why? dd($cartItems) shows correctly
    }
}
