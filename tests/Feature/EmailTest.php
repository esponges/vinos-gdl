<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\TransferOrderConfirmation;
use App\Http\Controllers\OrderController;
use App\Mail\AdminOrderConfirmationEmail;
use App\Http\Controllers\PaypalController;
use Illuminate\Foundation\Testing\WithFaker;
use App\Http\Controllers\PaypalRestApiController;
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

        Mail::fake();

        $paypalProvider = new PaypalRestApiController();
        $paypalProvider->prepareConfirmationEmails(
            $order,
            $products,
            $paidWithPayPal,
            $grandTotal,
            $balanceToPay,
            $user,
        );

        Mail::assertQueued(ConfirmationEmail::class);
        Mail::assertQueued(AdminOrderConfirmationEmail::class);
    }

    public function test_prepareConfirmationEmails()
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
        $order = Order::where('paypal_id', '9TH63882B06784722')->first();
        $user = User::find($userID);

        Mail::fake();

        $orderProvider = new OrderController();
        $orderProvider->prepareConfirmationEmails(
            $user,
            $order,
            $products,
            $grandTotal,
            $paidWithPayPal,
            $balanceToPay
        );

        Mail::assertQueued(TransferOrderConfirmation::class);
        Mail::assertQueued(AdminOrderConfirmationEmail::class);
    }
}
