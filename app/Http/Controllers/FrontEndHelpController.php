<?php

namespace App\Http\Controllers;

use App\Models\Cp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Facade\FlareClient\Http\Response;

class FrontEndHelpController extends Controller
{
    public function csrfToken()
    {
        $token = csrf_token();

        return response()->json($token, 200);
    }

    public function isAuth()
    {
        $isAuth = Auth::check();

        return response()->json($isAuth, 200);
    }

    public function userInfo()
    {
        if (Auth::check()) {
            $userInfo = [];

            $userInfo['userName'] = auth()->user()->name;
            $userInfo['userPhone'] = auth()->user()->phone;
            $userInfo['userEmail'] = auth()->user()->email;

            return response()->json($userInfo, 200);
        }
        return response()->json(['error' => 'user not logged in'], 200);
    }

    public function isRegistered($email)
    {
        // dd (User::where('email', $email)->first()->email);
        if (User::where('email', $email)->first()) {
            return response()->json(['isRegistered' => true]);
        }
        return response()->json(['isRegistered' => false]);
    }

    public function getCP()
    {
        $cp = Cp::all()->toArray();
        return response()->json($cp);
    }
}

