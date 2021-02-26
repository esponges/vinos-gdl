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
    public function dummyItems()
    {
        $product = Product::find(Factory::create()->numberBetween(1, 10));
        $productTwo = Product::find(Factory::create()->numberBetween(1, 10));

        \Cart::add($product->id, $product->name, $product->price, 1, array());
        \Cart::add($productTwo->id, $productTwo->name, $productTwo->price, 1, array());
    }

    public function test_confirmation_email_works()
    {
        // $this->dummyItems();
        $this->dummyItems();
        $this->withoutExceptionHandling();
        $cart = \Cart::getContent();
        $products = array_map(function ($item) {
            return [
                'name' => "anticipo " . $item['name'],
                'price' => $item['price'] * 0.07,
                'qty' => $item['quantity']
            ];
        }, $cart->toArray());

        $cartTotal = \Cart::getTotal() * 0.07;
        $grandTotal = \Cart::getTotal();
        $balanceToPay = $grandTotal - $cartTotal;
        $order = Factory::create()->numberBetween(1000, 2000);
        $user = User::first();

        // foreach ($products as $prod ) {
        //     dd($prod['name']);
        // }

        Mail::fake();

        // $response->dump();
        // $response->dumpHeaders();

        Mail::assertSent(ConfirmationEmail::class, function ($mail) use ($user, $products, $grandTotal, $cartTotal, $balanceToPay, $order) {
            return
            // $mail->order === $order &&
            $mail->products === $products &&
            $mail->cartTotal === $cartTotal &&
            $mail->grandTotal === $grandTotal &&
            $mail->balanceToPay === $balanceToPay &&
            $mail->hasTo($user->email);
        });
    }

    public function test_transfer_confirmation_email_works()
    {
        // $this->dummyItems();
        $this->dummyItems();
        $this->withoutExceptionHandling();
        $products = \Cart::getContent();

        $cartTotal = \Cart::getTotal() * 0.07;
        $grandTotal = \Cart::getTotal();
        $balanceToPay = $grandTotal - $cartTotal;
        $user = User::first();

        $order = new Order;
        $order->name = Factory::create()->name();
        $order->address = Factory::create()->sentence(2);
        $order->address_details = Factory::create()->sentence(2);
        $order->neighborhood = Factory::create()->sentence(2);
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->delivery_day = "Lunes";
        $order->delivery_schedule = "10 am a 2pm";
        $order->id = Factory::create()->numberBetween(1000, 2000);

        // foreach ($products as $prod ) {
        //     dd($prod['name']);
        // }

        Mail::fake();
        // $response->dump();
        // $response->dumpHeaders();

        Mail::assertSent(TransferOrderConfirmation::class, function ($mail) use ($user, $products, $grandTotal, $cartTotal, $balanceToPay, $order) {
            return
            $mail->order === $order &&
            $mail->products === $products &&
            $mail->grandTotal === $grandTotal &&
            $mail->cartTotal === $cartTotal &&
            $mail->balanceToPay === $balanceToPay &&
            $mail->hasTo($user->email);
        });
    }

    public function test_admin_order_confirmation_email()
    {
        $this->dummyItems();
        $this->withoutExceptionHandling();
        $products = \Cart::getContent();

        $cartTotal = \Cart::getTotal() * 0.07;
        $grandTotal = \Cart::getTotal();
        $balanceToPay = $grandTotal - $cartTotal;
        $user = User::first();

        $order = new Order;
        $order->name = Factory::create()->name();
        $order->address = Factory::create()->sentence(2);
        $order->address_details = Factory::create()->sentence(2);
        $order->neighborhood = Factory::create()->sentence(2);
        $order->cp = Factory::create()->numberBetween(20000, 30000);
        $order->delivery_day = "Lunes";
        $order->delivery_schedule = "10 am a 2pm";
        $order->id = Factory::create()->numberBetween(1000, 2000);

        // foreach ($products as $prod ) {
        //     dd($prod['name']);
        // }

        Mail::fake();

        $response = $this->get('/order/admin-order-email');

        $response->assertOk();
        // $response->dump();
        // $response->dumpHeaders();

        Mail::assertSent(AdminOrderConfirmationEmail::class, function ($mail) use ($user, $order, $products, $grandTotal, $cartTotal, $balanceToPay) {
            return
                $mail->order === $order &&
                $mail->products === $products &&
                $mail->grandTotal === $grandTotal &&
                $mail->cartTotal === $cartTotal &&
                $mail->balanceToPay === $balanceToPay &&
                $mail->hasTo($user->email);
        });
    }
}
