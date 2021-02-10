<?php

namespace Tests\Feature;

use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    public function addItems()
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

        $productTwo = Product::factory()->create();

        \Cart::add(array(
            'id' => $productTwo->id,
            'name' => $productTwo->name,
            'price' => $productTwo->price,
            'quantity' => Factory::create()->numberBetween(2, 6),
            'attributes' => [],
            'associatedModel' => $productTwo
        ));
    }

    public function test_order_gets_created()
    {
        $this->withoutExceptionHandling();
        $this->addItems();

        $response = $this->actingAs(User::first())->post('order/create', [
            'address' => Factory::create()->sentence(6),
            'payment_mode' => 'paypal',
        ]);

        $response->assertStatus(302);
    }

    // public function test_paypal()
    // {
    //     $this->withoutExceptionHandling();
    //     $order = Order::first();
    //     $this->addItems();

    //     $response = $this->actingAs(User::first())->get('paypal/checkout/' . $order->id);

    //     // $response->dumpHeaders();
    //     $response->dump();
    //     $response->getStatusCode();
    //     $response->assertStatus(302);
    //     $response->assertJsonFragment(["ACK" => "Success"]);
    // }

    /*
    *
    *
    Creating payment information
    */

    // public function test_success_payment_information()
    // {
    //     $this->withoutExceptionHandling();
    //     $this->addItems();
    //     $order = Order::first();

    //     $orderItems = DB::table('order_items')
    //         ->where('order_id', $order->id)
    //         ->get();

    //     $products = [];

    //     foreach ($orderItems as $item) {
    //         $product = Product::find($item->product_id)->toArray();
    //         $quantity = ['quantity' => $item->qty];
    //         $subtotal = ['subtotal' => $quantity['quantity'] * $product['price']];
    //         $total = array_merge($product, $quantity, $subtotal);
    //         array_push($products, $total);
    //     }

    //     $grandTotal = [];

    //     foreach ($products as $product) {
    //         array_push($grandTotal, $product['subtotal']);
    //     }

    //     $grandTotal = array_sum($grandTotal);

    //     dd (\Cart::getContent(), \Cart::getTotal());
    // }

    public function test_get_cart_total()
    {
        $this->withoutExceptionHandling();
        $this->addItems();

        $response = $this->get('cart/get-total');

        // $response->dump();
        // $response->dumpHeaders();
        $response->assertOk();
    }
}
