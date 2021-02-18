<?php

namespace Tests\Feature;

use App\Models\Product;
use Darryldecode\Cart\CartCondition;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CartTest extends TestCase
{
    public function dummyItems()
    {
        $product = Product::find(Factory::create()->numberBetween(1,10));
        $productTwo = Product::find(Factory::create()->numberBetween(1, 10));

        \Cart::add($product->id, $product->name, $product->price, 1, array());
        \Cart::add($productTwo->id, $productTwo->name, $productTwo->price, 1, array());
    }

    public function test_get_cart_items()
    {
        $this->withoutExceptionHandling();
        $cartContent = \Cart::getContent();
        $cartItems = \Cart::getTotalQuantity();

        $response = $this->get('/cart');

        $response->assertOk();
        $response->assertJsonFragment($cartContent->toArray());
    }

    public function test_get_cart_total_count()
    {
        $this->withoutExceptionHandling();
        $cartCount = \Cart::getTotalQuantity();

        $response = $this->get('/cart/count');

        $response->assertOk();
        $response->assertJsonFragment([$cartCount]);
    }

    public function test_can_add_items_to_cart()
    {
        $this->withoutExceptionHandling();
        $product = Product::find(1);

        $response = $this->get(route('cart.add', ['product' => $product, 'qty' => 1]));

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

    public function test_get_cart_net_total()
    {
        $this->withoutExceptionHandling();
        $this->dummyItems();

        $cart = \Cart::getTotal();

        $cartCondition = new CartCondition([
            'name' => 'Pago de anticipo',
            'type' => 'anticipo 7%',
            'target' => 'total',
            'value' => '-93%',
            'order' => 1
        ]);

        \Cart::condition($cartCondition);
        $cartWithDiscount = \Cart::getTotal();
        // $getConditions = \Cart::getConditions();
        // $getCart = \Cart::getContent();

        $this->assertEquals($cart * 0.07, $cartWithDiscount);

        // $cartIds = [];
        // $cartContent = \Cart::getContent();

        // foreach ($cartContent as $item ) {
        //     array_push($cartIds, $item->id);
        // }

        // $itemCondition = new CartCondition([
        //     'name' => 'anticipo',
        //     'type' => 'paypal',
        //     'value' => '-93%',
        // ]);

        // foreach ($cartIds as $id ) {
        //     \Cart::addItemCondition($id, $itemCondition);
        // }

        // $getCart = \Cart::getContent();
        // dd($getCart, \Cart::getTotal());
    }

    public function test_get_correct_total_from_map_array()
    {
        $this->withoutExceptionHandling();
        $this->dummyItems();

        $cart = \Cart::getContent();

        // manually get discount
        $cartItems = array_map(function ($item) {
            return [
                'name' => "anticipo " . $item['name'],
                'price' => $item['price'] * 0.07,
                'qty' => $item['quantity']
            ];
        }, $cart->toArray());

        $cartItemsTotal = [];
        foreach ($cartItems as $item) {
            array_push($cartItemsTotal, $item['price'] * $item['qty']);
        }
        $cartTotal = array_sum($cartItemsTotal);

        // using condition method
        $cartWithDiscount = \Cart::getTotal() * 0.07;

        $this->assertEquals($cartTotal, $cartWithDiscount);
    }

    public function test_get_subtotal_from_on_delivery_payment()
    {
        $this->withoutExceptionHandling();
        $this->dummyItems();

        $cartItems = \Cart::getContent();
        $cartTotal = 0;

        //add price for each item into variable
        foreach ($cartItems as $item ) {
            $cartTotal += ceil($item->price * $item->quantity * 0.07); // ceiling to avoig paypal bug
        }

        $response = $this->get('/cart/get-subtotal');

        $response->assertOk();
        // dd($response->ge);
        // $this->assertEquals($response->data, $cartTotal);
    }

}
