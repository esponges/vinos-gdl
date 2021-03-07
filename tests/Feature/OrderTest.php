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

        $productTwo = Product::find(Factory::create()->numberBetween(1,27));

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
        $cartTotal = \Cart::getTotal() * 0.07;
        $grandTotal = \Cart::getTotal();
        $user = User::first();
        $balanceToPay = $grandTotal - $cartTotal;

        $order = new Order;
        $order->name = Factory::create()->name();
        $order->address = Factory::create()->sentence(2);
        $order->payment_mode = Factory::create()->randomElement(['on_delivery', 'paypal']);
        $order->address_details = Factory::create()->sentence(2);
        $order->neighborhood = Factory::create()->sentence(2);
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->phone = Factory::create()->numberBetween('123456', '123443');
        $order->delivery_day = "Lunes";
        $order->delivery_schedule = "10 am a 2pm";
        $order->id = Factory::create()->numberBetween(1000, 2000);

        $orderInfo = [
            'user' => $user,
            'order' => $order,
            'balanceToPay' => $balanceToPay,
            'grandTotal' => $grandTotal,
        ];

        return $orderInfo;
    }

    public function test_order_gets_created()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();

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
        $this->mockCart();
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
            'neighborhood' => $orderInfo['order']['name'],
            'delivery_day' => $orderInfo['order']['delivery_day'],
            'delivery_schedule' => $orderInfo['order']['delivery_schedule'],
        ]);

        $response->assertStatus(200); // if it were Paypal would  be 302
        $response->assertViewIs('order.success');
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
