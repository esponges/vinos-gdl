<?php

namespace Tests\Feature;

use App\Mail\ConfirmationEmail;
use Faker\Factory;
use Tests\TestCase;
use App\Models\Product;
use App\Models\User;
use Tests\Feature\CartTest;
use Illuminate\Support\Facades\Mail;
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

        $response = $this->get('/order/email');

        $response->assertOk();
        // $response->dump();
        // $response->dumpHeaders();

        Mail::assertSent(ConfirmationEmail::class, function ($mail) use ($user, $products, $grandTotal, $cartTotal, $balanceToPay, $order) {
            return
            $mail->products === $products &&
            $mail->cartTotal === $cartTotal &&
            $mail->grandTotal === $grandTotal &&
            $mail->balanceToPay === $balanceToPay &&
            $mail->hasTo($user->email);
        });
    }
}
