<?php

namespace Tests\Feature;

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaypalController;
use App\Mail\AdminOrderConfirmationEmail;
use App\Mail\ConfirmationEmail;
use App\Mail\TransferOrderConfirmation;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailTest extends TestCase
{
    public function test_preparePaypalConfirmationEmails()
    {
        $this->withoutExceptionHandling();
        $orderTest =  new OrderTest();
        $orderTest->mockCart();
        $orderMock = $orderTest->mockOrder();
        $orderID = $orderMock['order']['id'];
        $userID = $orderMock['user']['id'];

        $cartTotal = \Cart::getTotal();
        $products = \Cart::getContent();
        $grandTotal = \Cart::getTotal();
        $balanceToPay = 0;
        $order = Order::find($orderID);
        $user = User::find($userID);

        Mail::fake();

        $paypalProvider = new PaypalController();
        $paypalProvider->preparePaypalConfirmationEmails(
            $cartTotal,
            $products,
            $grandTotal,
            $balanceToPay,
            $order,
            $user,
        );

        Mail::assertSent(ConfirmationEmail::class);
        Mail::assertSent(AdminOrderConfirmationEmail::class);
    }

    public function test_prepareConfirmationEmails()
    {
        $this->withoutExceptionHandling();
        $orderTest =  new OrderTest();
        $orderTest->mockCart();
        $orderMock = $orderTest->mockOrder();
        $orderID = $orderMock['order']['id'];
        $userID = $orderMock['user']['id'];

        $cartTotal = \Cart::getTotal();
        $products = \Cart::getContent();
        $grandTotal = \Cart::getTotal();
        $balanceToPay = 0;
        $order = Order::find($orderID);
        $user = User::find($userID);

        Mail::fake();

        $orderProvider = new OrderController();
        $orderProvider->prepareConfirmationEmails(
            $user,
            $order,
            $products,
            $grandTotal,
            $cartTotal,
            $balanceToPay
        );

        Mail::assertSent(TransferOrderConfirmation::class);
        Mail::assertSent(AdminOrderConfirmationEmail::class);
    }
}
