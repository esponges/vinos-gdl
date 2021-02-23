<?php

use App\Http\Controllers\GetUserInformation;
use App\Models\Cp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
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

Route::get('/is-auth', function () {
    return Response::json(Auth::check(), 200);
    // return response()->json(Auth::check());
})->name('is-auth');

Route::get('/user-name', function () {
    if (Auth::check()) {
        $userName = auth()->user()->name;
        return response()->json($userName, 200);
    }
});

Route::get('get-CP', function () {
    $cp = Cp::all()->toArray();
    return response()->json($cp);
});

Route::get('/is-registered/{email}', [GetUserInformation::class, 'isRegistered'])->name('userInfo.isRegistered');
