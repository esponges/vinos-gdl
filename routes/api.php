<?php

use App\Http\Controllers\FrontEndHelpController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/get-CP', [FrontEndHelpController::class, 'getCP']);
Route::get('/is-auth', [FrontEndHelpController::class, 'isAuth'])->name('is-auth');
Route::get('/user-info', [FrontEndHelpController::class, 'userInfo'])->name('user.info');
Route::get('/is-registered/{email}', [FrontEndHelpController::class, 'isRegistered'])->name('userInfo.isRegistered');

Route::get('/csrf-token', [FrontEndHelpController::class, 'csrfToken'])->name('csrf-token');



