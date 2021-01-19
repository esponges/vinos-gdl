<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CartTest extends TestCase
{
    public function dummyItem()
    {
        $product = Product::find(1);

        \Cart::add($product->id, $product->name, $product->price, 1, array());
    }

    public function test_get_cart_items()
    {
        $this->withoutExceptionHandling();
        $cartContent = \Cart::getContent();

        $response = $this->get('/cart');

        $response->assertOk();
        $response->assertJsonFragment($cartContent->toArray());
    }

    public function test_can_add_items_to_cart()
    {
        $this->withoutExceptionHandling();
        $product = Product::find(1);

        $response = $this->get(route('cart.add', $product));

        $response->assertOk();
        // $response->dump();
        $response->assertJson([$product->name . ' agregado al carrito'], 200);
    }

    public function test_remove_items_from_cart()
    {
        $this->withoutExceptionHandling();
        $product = Product::find(1);

        $response = $this->get(route('cart.destroy', $product));

        $response->assertOk();
        // $response->dump();
        $response->assertJson([$product->name . ' eliminado del carrito']);
    }
}
