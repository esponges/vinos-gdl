<?php

namespace Tests\Feature;

use App\Http\Controllers\EmailController;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\TransferOrderConfirmation;
use App\Mail\AdminOrderConfirmationEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EmailTest extends TestCase
{
    public function test_preparePaypalConfirmationEmails()
    {
        $this->withoutExceptionHandling();
        $orderTest =  new OrderTest();
        $orderTest->mockCart();
        $orderMock = $orderTest->mockOrder();
        $orderID = $orderMock['order']['id'];

        $order = Order::where('paypal_id', '9TH63882B06784722')->first();
        $products = \Cart::getContent();
        $paidWithPayPal = $order->balance;
        $grandTotal = $order->total;
        $balanceToPay = $grandTotal - $paidWithPayPal;
        $user = User::first();
        $paymentType = $order->payment_mode;

        Mail::fake();

        $emailController = new EmailController();
        $emailController->prepareConfirmationEmails(
            $order,
            $products,
            $paidWithPayPal,
            $grandTotal,
            $balanceToPay,
            $user,
            $paymentType
        );

        Mail::assertSent(ConfirmationEmail::class);
    }

    public function test_prepareConfirmationEmails_transfer()
    {
        $this->withoutExceptionHandling();
        $orderTest =  new OrderTest();
        $orderTest->mockCart();
        $orderMock = $orderTest->mockOrder();
        $orderID = $orderMock['order']['id'];
        $userID = $orderMock['user']['id'];

        $paidWithPayPal = \Cart::getTotal();
        $products = \Cart::getContent();
        $grandTotal = \Cart::getTotal();
        $balanceToPay = 0;
        $order = Order::where('payment_mode', 'transfer')->first();
        $user = User::find($userID);
        $paymentType = $order->payment_mode;

        Mail::fake();

        $emailController = new EmailController();
        $emailController->prepareConfirmationEmails(
            $order,
            $products,
            $paidWithPayPal,
            $grandTotal,
            $balanceToPay,
            $user,
            $paymentType,
        );

        Mail::assertSent(TransferOrderConfirmation::class);
    }

    public function test_sendAdminEmails()
    {
        $this->withoutExceptionHandling();

        $orderTest =  new OrderTest();
        $orderTest->mockCart();
        $orderMock = $orderTest->mockOrder();
        $orderID = $orderMock['order']['id'];

        Mail::fake();

        $response = $this->actingAs(User::first())->post(
            '/order/success/admin-email/', [
                'orderID' => $orderID
            ]
            // route('order.sendAdminEmails', $orderID)
        );

        $response->assertOk();
        // Mail::assertNothingSent();
        Mail::assertSent(AdminOrderConfirmationEmail::class);
    }
}
