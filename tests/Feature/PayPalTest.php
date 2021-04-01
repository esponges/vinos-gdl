<?php

namespace Tests\Feature;

use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Http\Controllers\PaypalController;
use Srmklive\PayPal\Services\ExpressCheckout;
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
        $order->order_name = Factory::create()->name();
        $order->phone = '1234567890';
        $order->user_id = $user->id;
        $order->total = $grandTotal;
        $order->total_items = \Cart::getContent()->count();
        $order->address = Factory::create()->sentence(2);
        $order->address_details = Factory::create()->sentence(2);
        $order->neighborhood = Factory::create()->sentence(2);
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->payment_mode = Factory::create()->randomElement(array('paypal', 'on_delivery'));
        $order->delivery_day = "Lunes";
        $order->delivery_schedule = "10 am a 2pm";
        $order->id = Factory::create()->numberBetween(1000, 2000);
        $order->save();

        $orderInfo = [
            'user' => $user,
            'order' => $order->toArray(),
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
        $orderId = Factory::create()->numberBetween(1, 1000);
        $newCheckOutData = new PaypalController;

        $response = $newCheckOutData->getCheckoutData($orderId, $payment_mode);
        $responseTotal = $response['total'];

        $subtotalRoute = $this->get('/cart/get-subtotal');

        $this->assertEquals($responseTotal, $subtotalRoute->original);
    }

    public function test_paypal_response_getExpressCheckoutSuccess()
    {
        $payment_status = [
            "TOKEN" => "EC-8RT56627YV7948014",
            "BILLINGAGREEMENTID" => "B-2FL28347PG854923E",
            "SUCCESSPAGEREDIRECTREQUESTED" => "false",
            "TIMESTAMP" => "2021-03-05T03:31:21Z",
            "CORRELATIONID" => "f4c023dcb82f",
            "ACK" => "Success",
            "VERSION" => "123",
            "BUILD" => "55384336",
            "INSURANCEOPTIONSELECTED" => "false",
            "SHIPPINGOPTIONISDEFAULT" => "false",
            "PAYMENTINFO_0_TRANSACTIONID" => "5NT73451TB651324X",
            "PAYMENTINFO_0_TRANSACTIONTYPE" => "cart",
            "PAYMENTINFO_0_PAYMENTTYPE" => "instant",
            "PAYMENTINFO_0_ORDERTIME" => "2021-03-05T03:31:20Z",
            "PAYMENTINFO_0_AMT" => "105.00",
            "PAYMENTINFO_0_FEEAMT" => "9.45",
            "PAYMENTINFO_0_TAXAMT" => "0.00",
            "PAYMENTINFO_0_CURRENCYCODE" => "MXN",
            "PAYMENTINFO_0_PAYMENTSTATUS" => "Completed",
            "PAYMENTINFO_0_PENDINGREASON" => "None",
            "PAYMENTINFO_0_REASONCODE" => "None",
            "PAYMENTINFO_0_PROTECTIONELIGIBILITY" => "Eligible",
            "PAYMENTINFO_0_PROTECTIONELIGIBILITYTYPE" => "ItemNotReceivedEligible,UnauthorizedPaymentEligible",
            "PAYMENTINFO_0_SELLERPAYPALACCOUNTID" => "sb-tr4z02598960@business.example.com",
            "PAYMENTINFO_0_SECUREMERCHANTACCOUNTID" => "DZKY2WMT7ZBKW",
            "PAYMENTINFO_0_ERRORCODE" => "0",
            "PAYMENTINFO_0_ACK" => "Success",
        ];

        $status = $payment_status['PAYMENTINFO_0_PAYMENTSTATUS'];

        // dd (isset($payment_status['ACK']));

        if (in_array($status, ['Completed', 'Processed'])) {
            $fetchStatus = true;
        } else $fetchStatus = false;

        $this->assertTrue($fetchStatus, $payment_status['ACK']);
    }

    public function test_issetACKindex () {
        $paypal_payment_response = [];

        if (isset($paypal_payment_response['ACK'])) $success = true;
        else $success = false;

        $this->assertFalse($success);
    }

    public function test_orderSuccess_paypal()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();
        $order = Order::first();
        $cartTotal = \Cart::getTotal() * Factory::create()->randomElement([0.07, 1]);

        // $orderInfo = array(
        //     'order' => $order->toArray(),
        //     'products' => \Cart::getContent()->toArray(),
        //     'grandTotal' => \Cart::getTotal(),
        //     'balanceToPay' => $grandTotal - $cartTotal,
        //     'cartTotal' => $cartTotal,
        // );
        // $orderInfo = 'im info';

        $response = $this->get(route('order.success', [$order->id, $cartTotal]));

        $response->assertOk();

    }

    public function test_PaypalFail()
    {
        $this->withoutExceptionHandling();
        // $paypal = new PaypalController();

        $response = $this->get(route('paypal.fail', [1, 'a horrible error', 'missing_status']));

        $response->assertOk();
        $response->assertViewIs('order.failButCharged');

        // $this->assertNotEmpty($response);
    }

    public function test_PaypalFail_not_charged()
    {
        $this->withoutExceptionHandling();
        // $paypal = new PaypalController();

        $response = $this->get(route('paypal.fail', [1, 'a horrible error', 'else']));

        $response->assertOk();
        $response->assertViewIs('order.fail');

        // $this->assertNotEmpty($response);
    }

    public function getCheckoutData()
    {
        return [
            "items" =>  [
                9 => [
                "name" => "anticipo Chivas 12YO 750ml",
                "price" => 29.0,
                "qty" => 1,
                ],
                10 => [
                "name" => "anticipo Passport 700ml",
                "price" => 8.0,
                "qty" => 1,
                ],
            ],
            "return_url" => "https://vinos-gdl.test/paypal/success/1/on_delivery/37",
            "cancel_url" => "https://vinos-gdl.test/paypal/fail/1/cancel_url%20from%20getCheckoutData",
            "invoice_id" => "6046cf76ba098-1",
            "invoice_description" => "Recibo de orden # 1 ",
            "total" => 37.0,
            ];
    }

    /* getExpressCheckout */

    // public function test_getExpressCheckoutSuccess()
    // {
    //     $this->withoutExceptionHandling();
    //     $this->mockCart();

    //     $token = "EC-4WS52529FV043302E";
    //     $PayerID = "D44EY4R4GZ7D8";
    //     $checkoutData = $this->getCheckoutData();

    //     $orderId = 1;
    //     $cartTotal = \Cart::getTotal();

    //     $this->provider = new ExpressCheckout();
    //     $response = $this->provider->getExpressCheckoutDetails($token); // no charge to user yet, only authorizations

    //     if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) {

    //         // proceed to charge the user with doExpressCheckoutPayment
    //         $payment_status = $this->provider->doExpressCheckoutPayment($checkoutData, $token, $PayerID);

    //         if ($payment_status['PAYMENTINFO_0_PAYMENTSTATUS']) {

    //             $status = $payment_status['PAYMENTINFO_0_PAYMENTSTATUS'];

    //             if (in_array($status, ['Completed', 'Processed', 'Completed_Funds_Held'])) {
    //                 $order = Order::find($orderId);
    //                 $order->is_paid = 1;
    //                 $order->save();
    //                 $products = \Cart::getContent();
    //                 $grandTotal = \Cart::getTotal();
    //                 $balanceToPay = $grandTotal - $cartTotal; // if (100% paypal) &&  0
    //                 $user = auth()->user();

    //                 // send success email
    //                 // $this->preparePaypalConfirmationEmails($order, $products, $cartTotal, $grandTotal, $balanceToPay, $user);
    //                 // return redirect(route('order.success', [$order->id, $cartTotal]));
    //             }

    //             dd($status, 'not charged');
    //         }
    //         dd($payment_status, 'no payment status');
    //     }
    //     dd($response, 'no ack success');
    //     dd('hello');
    // }
}
