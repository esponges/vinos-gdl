<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

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
    }

    public function test_order_gets_created()
    {
        $this->withoutExceptionHandling();
        $this->addItems();

        $response = $this->actingAs(User::first())->post('order/create', [
            'address' => Factory::create()->sentence(6),
            'payment_mode' => 'paypal',
        ]);

        $response->assertOk();
    }
}
