<?php

use App\Models\Product;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaypalController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/* Load SPA */
Route::get('/', function () {
    return view('index');
});

Route::resource('products', ProductController::class);
Route::get('/products/{id}/links', [ProductController::class, 'getCompetidorsLinks']);

Route::resource('categories', CategoryController::class);

Route::prefix('cart')->group( function () {
    Route::get('/', [CartController::class, 'index']);
    Route::get('/count', [CartController::class, 'count']);
    Route::get('/get-total', [CartController::class, 'getTotal']); // cart total
    Route::get('/get-subtotal', [CartController::class, 'getSubTotal']);

    Route::get('/{product}/add/{qty}', [CartController::class, 'add'])->name('cart.add');
    Route::get('/{product}/destroy', [CartController::class, 'destroy'])->name('cart.destroy');
});

Route::prefix('order')->group( function () {
    Route::post('create', [OrderController::class, 'create']);
    Route::get('email', [OrderController::class, 'sendConfirmationEmail']);
});

Route::prefix('paypal')->group( function () {
    Route::get('/checkout/{orderId}/{paymentMode}', [PaypalController::class, 'checkout'])->name('paypal.checkout')->middleware('auth:sanctum');
    Route::get('/success/{orderId}/{paymentMode}/{cartTotal}', [PaypalController::class, 'getExpressCheckoutSuccess'])->name('paypal.success');
    Route::get('/fail/{orderId}', [PaypalController::class, 'paypalFail'])->name('paypal.fail');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
