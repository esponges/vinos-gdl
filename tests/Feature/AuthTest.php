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
            'password_confirmation' => Hash::make('123456'),
            'age' => Factory::create()->numberBetween(1, 4),
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

        // $response->getStatusCode();
        // $response->dumpHeaders();
        // $response->dump();
        $response->assertStatus(302);
        $this->assertAuthenticated();
    }

    public function test_user_can_log_out()
    {
        $this->withoutExceptionHandling();

        $user = User::first();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertStatus(302);
    }

    public function test_get_user_info()
    {
        $this->withoutExceptionHandling();

        $user = User::first();

        $response = $this->actingAs($user)
            ->get('/api/user-info');

        // $response->dumpSession();
        // $response->dump();

        $response->assertOk();
        $response->assertJsonFragment([$user->name]);
    }

    public function test_if_user_exists()

    {
        $this->withoutExceptionHandling();
        $email = User::first()->email;
        // $email = 'an email';

        $response = $this->get(route('userInfo.isRegistered', $email));

        $response->assertOk();
        $response->assertJsonFragment(['isRegistered' => true]);
    }
}
