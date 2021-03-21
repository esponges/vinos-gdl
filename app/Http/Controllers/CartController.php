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

    //cart subtotal
    //for 7% on delivery payment
    public function getSubTotal()
    {
        $cart = \Cart::getContent();

        $cartItems = array_map(function ($item) {
            return [
                'name' => "anticipo " . $item['name'],
                'price' => ceil($item['price'] - ($item['price'] / 1.07)),
                'qty' => $item['quantity']
            ];
        }, $cart->toArray());

        $subtotal = 0;
        foreach ($cartItems as $item) {
            $subtotal += $item['price'] * $item['qty'];
        }

        return response()->json($subtotal);
    }

    //remove item from cart
    public function destroy(Product $product)
    {
        \Cart::remove($product->id);

        return response()->json([$product->name . ' eliminado del carrito']);
    }

    /* Couldn't update method work */
    /* Neither by simple update nor relative config */

    // public function removeOneItem($productId)
    // {
    //     $product = \Cart::get($productId);
    //     $productCount = $product->quantity;
    //     $cartOld = \Cart::getContent();

    //     \Cart::update($productId, array(
    //         'relative' => false,
    //         'value' => $productCount - 1,
    //     ));

    //     dd('old', $cartOld, 'new', \Cart::getContent(), 'id', $productId);

    //     return response()->json(['1 unit of ' . $productId . ' removed']);
    // }
}
