<?php

use App\Models\Product;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaypalController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PaypalRestApiController;
use Darryldecode\Cart\CartCondition;
use Tests\Feature\PaypalRestApiTest;

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
Route::get('/category-list', [CategoryController::class, 'categoryNames'])->name('category.names');

Route::prefix('cart')->group( function () {
    Route::get('/', [CartController::class, 'index']);
    Route::get('/count', [CartController::class, 'count']);
    Route::get('/get-total', [CartController::class, 'getTotal']); // cart total
    Route::get('/get-subtotal', [CartController::class, 'getSubTotal']);
    Route::get('/{product}/destroy', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::get('/{productId}/destroy-one', [CartController::class, 'removeOneItem'])->name('cart.removeOne');
    Route::get('/{product}/add/{qty}', [CartController::class, 'add'])->name('cart.add');
});

Route::prefix('order')->group( function () {
    /* srmk paypal laravel v3 */
    Route::post('/info', [OrderController::class, 'getOrderInfo'])->name('order.info')->middleware('auth:sanctum');
    Route::post('/rest-api/create', [OrderController::class, 'paypalApiOrder'])->name('order.paypalApiOrder');
    Route::get('/success/admin-email/{orderID}', [EmailController::class, 'sendAdminEmails'])->middleware('auth:sanctum');
});

Route::prefix('paypal')->group( function () {
    /* v3  */
    Route::post('/rest-api/checkout/', [PaypalRestApiController::class, 'restApiCheckout'])->name('paypal.restApiCheckout')->middleware('auth:sanctum');
    Route::post('/rest-api/capture-order/', [PaypalRestApiController::class, 'captureOrder'])->name('paypal.captureOrder')->middleware('auth:sanctum');
    /* v1 expressCheckout */
    Route::get('/checkout/{orderId}/{paymentMode}', [PaypalController::class, 'checkout'])->name('paypal.checkout')->middleware('auth:sanctum');
    Route::get('/fail/{orderId}/{error}/{errorHeader}', [PaypalController::class, 'paypalFail'])->name('paypal.fail');
    Route::get('/success/{orderId}/{paymentMode}/{cartTotal}', [PaypalController::class, 'getExpressCheckoutSuccess'])->name('paypal.success');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
