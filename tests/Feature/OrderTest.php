<?php

namespace Tests\Feature;

use App\Http\Controllers\OrderController;
use App\Models\Cp;
use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    public function mockCart()
    {
        $product = Product::first();

        \Cart::add(array(
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'quantity' => Factory::create()->numberBetween(2, 6),
            'attributes' => [],
            'associatedModel' => $product
        ));

        $productTwo = Product::find(Factory::create()->numberBetween(1, 27));

        \Cart::add(array(
            'id' => $productTwo->id,
            'name' => $productTwo->name,
            'price' => $productTwo->price,
            'quantity' => Factory::create()->numberBetween(2, 6),
            'attributes' => [],
            'associatedModel' => $productTwo
        ));
    }

    public function mockOrder()
    {
        $this->mockCart();

        $order = new Order;
        $user = User::first()->toArray();

        $order->total = \Cart::getTotal();
        $order->total_items = \Cart::getContent()->count();
        $order->payment_mode = Factory::create()->randomElement(['on_delivery', 'paypal']);
        $order->address = Factory::create()->sentence(2);
        $order->address_details = Factory::create()->sentence(2);
        $order->phone = Factory::create()->numberBetween('123456', '123443');
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->user_id = $user['id'];
        $order->order_name = Factory::create()->name();
        $order->delivery_day = "Lunes";
        $order->delivery_schedule = "10 am a 2pm";
        $order->neighborhood = Factory::create()->sentence(2);

        if($order->payment_mode == 'on_delivery'){
            $cart = \Cart::getContent();

            $cartItems = array_map(function ($item) {
                return [
                    'name' => "anticipo " . $item['name'],
                    'price' => ceil($item['price'] - ($item['price'] / 1.07)),
                    'qty' => $item['quantity']
                ];
            }, $cart->toArray());

            $subtotal = 0;
            foreach ($cartItems as $item) {
                $subtotal += $item['price'] * $item['qty'];
            }
        }
        $order->balance = $subtotal ?? 0;

        $order->save();

        $orderInfo = [
            'user' => $user,
            'order' => $order->toArray(),
        ];

        return $orderInfo;
    }

    public function test_paypalApiOrder()
    {
        $this->withoutExceptionHandling();
        $order = $this->mockOrder()['order'];

        $response = $this->actingAs(User::first())->post('/order/rest-api/create', [
            'total' => $order['total'],
            'total_items' => $order['total_items'],
            'payment_mode' => $order['payment_mode'],
            'address' => $order['address'],
            'address_details' => $order['address_details'],
            'phone' => $order['phone'],
            'cp' => $order['cp'],
            'user_id' => $order['total'],
            'order_name' => $order['total'],
            'delivery_day' => $order['delivery_day'],
            'delivery_schedule' => $order['delivery_schedule'],
            'neighborhood' => $order['total'],
            'balance' => $order['balance'],
        ]);

        $response->assertStatus(200);

        if ($order['payment_mode'] !== 'transfer') {

            $response->assertJsonFragment(['status' => 'CREATED']);
        } else {

            $response->assertJsonFragment(['status' => 'Transfer Order Created']);
        }
    }

    public function test_paypalApiOrder_notAuth()
    {
        $this->withoutExceptionHandling();
        $order = $this->mockOrder()['order'];

        $response = $this->post(route('order.paypalApiOrder', [
            'total' => $order['total'],
            'total_items' => $order['total_items'],
            'user_id' => $order['user_id'],
            'order_name' => $order['order_name'],
            'payment_mode' => $order['payment_mode'],
            'address' => $order['address'],
            'address_details' => $order['address_details'],
            'delivery_day' => $order['delivery_day'],
            'delivery_schedule' => $order['delivery_schedule'],
            'phone' => $order['phone'],
            'cp' => $order['cp'],
            'neighborhood' => $order['neighborhood'],
            'balance' => $order['balance'] ?? 0,
        ]));

        $response->assertStatus(408);
    }

    public function test_getOrderInfo()
    {
        $this->withoutExceptionHandling();
        // get order
        $order = Order::first();
        $vinoreoOrderID = $order->id;
        // get cart items
        $orderController = new OrderController();
        $cartItems = $orderController->getOrderItems($order->id);

        $response = $this->actingAs(User::first())->post('/order/info', [
            'vinoreoOrderID' => $vinoreoOrderID,
        ]);

        $response->assertOk();
        $response->assertJsonFragment($order->toArray(), $cartItems);
    }
}
