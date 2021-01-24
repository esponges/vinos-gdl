<?php

namespace Tests\Feature;

use Faker\Factory;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    public function test_create_user()
    {
        $this->withoutExceptionHandling();

        $user = [
            'name' => Factory::create()->name(),
            'email' => Factory::create()->email(),
        ];

        $response = $this->post('/register', [
            'name' => $user['name'],
            'email' => $user['email'],
            'password' => Hash::make('123456'),
            'password_confirmation' => Hash::make('123456')
        ]);

        // $response->dumpHeaders();
        // $response->dump();

        $response->assertStatus(302);
    }

    public function test_log_user()
    {
        $this->withoutExceptionHandling();

        // $user = User::first();
        $user = User::first();
        // dd($user);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => '123456',
        ]);

        $response->getStatusCode();
        // $response->dumpHeaders();
        // $response->dump();
        $response->assertStatus(302);
    }

    public function test_user_can_log_out()
    {
        $this->withoutExceptionHandling();

        $user = User::first();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertStatus(302);
    }
}
