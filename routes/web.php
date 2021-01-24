<?php

use App\Models\Product;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
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

Route::resource('categories', CategoryController::class);

Route::prefix('cart')->group( function () {
    Route::get('/', [CartController::class, 'index']);
    Route::get('/count', [CartController::class, 'count']);
    Route::get('/{product}/add', [CartController::class, 'add'])->name('cart.add');
    Route::get('/{product}/destroy', [CartController::class, 'destroy'])->name('cart.destroy');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
