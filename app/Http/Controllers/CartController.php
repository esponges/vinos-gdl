<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    //get cart items
    public function index()
    {
        return response()->json(\Cart::getContent());
    }

    //add item to cart
    public function add(Product $product)
    {
        \Cart::add(array(
            'id' => $product->id, // inique row ID
            'name' => $product->name,
            'price' => $product->price,
            'quantity' => 1,
            'attributes' => array()
        ));

        return response()->json([$product->name . ' ' . $product->capacity .  'ml agregado al carrito'], 200);
    }

    //remove item from cart
    public function destroy(Product $product)
    {
        \Cart::remove($product->id);

        return response()->json([$product->name . " " . $product->capacity . 'ml eliminado del carrito']);
    }
}
