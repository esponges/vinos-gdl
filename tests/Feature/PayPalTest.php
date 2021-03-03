<?php

namespace Tests\Feature;

use App\Http\Controllers\PaypalController;
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
        $order->payment_mode = Factory::create()->randomElement(array('paypal', 'on_delivery'));
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

    public function test_paypal_payment_start()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();
        $orderInfo = $this->mockOrder();

        $response = $this->actingAs($orderInfo['user'])->get(route('paypal.checkout', array(
            'orderId' => $orderInfo['order']['id'],
            'paymentMode' => $orderInfo['order']['payment_mode']
        )));

        $response->assertStatus(302); // redirecting to paypal
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

    public function test_7_paypal_subtotal()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();

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
        $roundedSubtotal = ceil($subtotal);

        $response = $this->get('/cart/get-subtotal');

        $response->assertStatus(200);
        $this->assertEquals($subtotal, $response->original);
    }

    /* confirm that get-subtotal is equal that what client is being charged
    *  in paypal when paying "on delivery" - 7% of total, rest cash.
    */
    public function test_getCheckOutData_with_cart_get_subtotal()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();
        $payment_mode = 'on_delivery';
        $orderId = Factory::create()->numberBetween(1,1000);
        $newCheckOutData = new PaypalController;

        $response = $newCheckOutData->getCheckoutData($orderId, $payment_mode);
        $responseTotal = $response['total'];

        $subtotalRoute = $this->get('/cart/get-subtotal');

        dd($response, $subtotalRoute->original);

        $this->assertEquals($responseTotal, $subtotalRoute->original);
    }
}
