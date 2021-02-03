<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    //get cart items
    public function index()
    {
        // returns all cart info and cart count
        return response()->json(\Cart::getContent(), 200);
    }

    //add item to cart
    public function add(Product $product, $qty)
    {
        \Cart::add(array(
            'id' => $product->id, // inique row ID
            'name' => $product->name,
            'price' => $product->price,
            'quantity' => $qty,
            'attributes' => array()
        ));

        return response()->json([$product->name . ' agregado al carrito'], 200);
    }

    // cart count
    public function count()
    {
        return response()->json([\Cart::getTotalQuantity()]);
    }

    //get cart total
    public function getTotal()
    {
        return response()->json(\Cart::getTotal());
    }

    //remove item from cart
    public function destroy(Product $product)
    {
        \Cart::remove($product->id);

        return response()->json([$product->name . ' eliminado del carrito']);
    }
}
