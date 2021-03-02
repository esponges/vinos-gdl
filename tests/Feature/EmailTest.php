<?php

namespace Tests\Feature;

use App\Mail\AdminOrderConfirmationEmail;
use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Tests\Feature\CartTest;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\Mail;
use App\Mail\TransferOrderConfirmation;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EmailTest extends TestCase
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
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->phone = Factory::create()->numberBetween('123456', '123443');
        $order->neighborhood = Factory::create()->sentence(2);
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

    public function test_confirmation_email_works()
    {
        $this->withoutExceptionHandling();
        $this->mockCart();
        $orderInfo = $this->mockOrder();

        $order = $orderInfo['order'];
        $grandTotal = $orderInfo['grandTotal'];
        $balanceToPay = $orderInfo['balanceToPay'];
        $user = $orderInfo['user'];
        $cartTotal = \Cart::getTotal();
        $products = \Cart::getContent();

        Mail::to($user->email)->send(new ConfirmationEmail($cartTotal, $products, $grandTotal, $balanceToPay, $order, $user));

        // Mail::fake();

        // $response->dump();
        // $response->dumpHeaders();

        // Mail::assertSent(ConfirmationEmail::class, function ($mail) use ($user, $products, $grandTotal, $cartTotal, $balanceToPay, $order) {
        //     return
        //     $mail->order === $order &&
        //     $mail->products === $products &&
        //     $mail->cartTotal === $cartTotal &&
        //     $mail->grandTotal === $grandTotal &&
        //     $mail->balanceToPay === $balanceToPay &&
        //     $mail->hasTo($user->email);
        // });
    }
}
