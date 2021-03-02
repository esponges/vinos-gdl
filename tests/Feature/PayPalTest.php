<?php

namespace Tests\Feature;

use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PayPalTest extends TestCase
{
    public function mockCart()
    {
        $product = Product::find(Factory::create()->numberBetween(1, 10));
        $productTwo = Product::find(Factory::create()->numberBetween(1, 10));

        \Cart::add($product->id, $product->name, $product->price, 1, array());
        \Cart::add($productTwo->id, $productTwo->name, $productTwo->price, 1, array());
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
        $order->address_details = Factory::create()->sentence(2);
        $order->neighborhood = Factory::create()->sentence(2);
        $order->cp = Factory::create()->numberBetween(20000, 30000);
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

        public function test_paypal_succeeds()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();
        $order = Order::first();
        $paymentMode = Factory::create()->randomElement(array('paypal', 'on_delivery'));
        $user = User::first();

        $response = $this->actingAs($user)->get('paypal/checkout/' . $order->id . "/" . $paymentMode);

        // $response->dumpHeaders();
        // $response->dump();
        // $response->getStatusCode();
        $response->assertStatus(302);
        $response->assertSee('https://www.sandbox.paypal.com/webscr?cmd=_express-checkout');
    }

    public function test_payment_paypal_payment_fail()
    {

        $this->withoutExceptionHandling();
        $this->mockCart();
        $orderInfo = $this->mockOrder();
        $orderId = $orderInfo['order']->id;

        $response = $this->get(route('paypal.fail', $orderId));
        // $contents = (string) $this->view('order.fail');
        $view = $this->view('order.fail');

        $response->assertOk();
        $view->assertSee('Tuvimos problemas con tu compra');

        // $response->assertViewIs('order.fail');
        // $response->assertViewHas('order', $contents);
    }
}
