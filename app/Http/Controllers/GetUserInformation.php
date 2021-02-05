<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class GetUserInformation extends Controller
{
    public function isRegistered($email)
    {
        // dd (User::where('email', $email)->first()->email);
        if (User::where('email', $email)->first()) {
            return response()->json(['isRegistered' => true]);
        }
        return response()->json(['isRegistered' => false]);
    }
}
