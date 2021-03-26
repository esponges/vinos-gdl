<?php

namespace Tests\Feature;

use App\Models\Cp;
use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\WithFaker;
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
        $order->order_name = Factory::create()->name();
        $order->address = Factory::create()->sentence(2);
        $order->payment_mode = Factory::create()->randomElement(['on_delivery', 'paypal']);
        $order->address_details = Factory::create()->sentence(2);
        $order->neighborhood = Factory::create()->sentence(2);
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->phone = Factory::create()->numberBetween('123456', '123443');
        $order->delivery_day = "Lunes";
        $order->delivery_schedule = "10 am a 2pm";

        if ($order->payment_mode == 'on_delivery') {
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

            $order->balance = $subtotal;
        }

        $user = User::first()->toArray();

        $order->total = \Cart::getTotal();
        $order->total_items = \Cart::getContent()->count();
        $order->user_id = $user['id'];
        $order->save();

        $orderInfo = [
            'user' => $user,
            'order' => $order->toArray(),
        ];

        return $orderInfo;
    }

    public function test_order_gets_created()
    {
        $this->withoutExceptionHandling();
        $this->mockOrder();

        $response = $this->actingAs(User::first())->post('order/create', [
            'address' => Factory::create()->sentence(6),
            'payment_mode' => 'on_delivery',
            'order_name' => Factory::create()->name(),
            'phone' => "1258245689",
            'neighborhood' => 'Barrio Bravo',
            'cp' => '25678',
            'delivery_day' => "lunes",
            'delivery_schedule' => '10am a 12pm',
        ]);

        $response->assertStatus(302);
    }

    public function test_transfer_payment_works()
    {
        $this->withoutExceptionHandling();
        $orderInfo = $this->mockOrder();
        $user = User::first();

        // dd($orderInfo['order']['phone']);

        $response = $this->actingAs($user)->post('/order/create', [
            'total' => \Cart::getTotal(),
            'total_items' => \Cart::getContent()->count(),
            'payment_mode' => 'transfer',
            'address' => $orderInfo['order']['address'],
            'phone' => $orderInfo['order']['phone'],
            'cp' => $orderInfo['order']['cp'],
            'user_id' => $orderInfo['user']['id'],
            'order_name' => $orderInfo['user']['name'],
            'neighborhood' => $orderInfo['order']['neighborhood'],
            'delivery_day' => $orderInfo['order']['delivery_day'],
            'delivery_schedule' => $orderInfo['order']['delivery_schedule'],
        ]);

        $response->assertStatus(302); //
    }

    public function test_transfer_payment_route()
    {
        $this->withoutExceptionHandling();
        $this->mockOrder();
        $orderId = Order::first()->id;

        $response = $this->actingAs(User::first())->get(route('paypal.transfer', $orderId));

        $response->assertOk();
    }

    public function test_if_unauth_user_cant_create_order_not_auth()
    {
        $this->withoutExceptionHandling();

        $this->expectException(AuthenticationException::class);

        $this->postJson('/order/create');
    }


    public function test_get_cart_total()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();

        $response = $this->get('cart/get-total');

        // $response->dump();
        // $response->dumpHeaders();
        $response->assertOk();
    }
}
