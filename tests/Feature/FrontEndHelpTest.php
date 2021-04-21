<?php

namespace Tests\Feature;

use App\Models\User;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FrontEndHelpTest extends TestCase
{
    public function test_getCsrfToken()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/api/get-CP');

        $response->assertOk();
    }

    public function test_isAuth()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/api/is-auth');

        $response->assertOk();
    }

    public function test_userInfo()
    {
        $this->withoutExceptionHandling();
        $user = User::first();

        $response = $this->actingAs($user)->get('/api/user-info');

        $response->assertOk();
        $response->assertJsonFragment(['userEmail' => $user->email]);
    }

    public function test_isRegistered()
    {
        $this->withoutExceptionHandling();
        $email = Factory::create()->randomElement(['email@example.com', User::first()->email]);

        $response = $this->get('/api/is-registered/' . $email);

        $response->assertOk();
        $email !== 'email@example.com'
            ? $response->assertJson(['isRegistered' => true])
            : $response->assertJson(['isRegistered' => false]);
    }

    public function test_getCP()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/api/get-CP');

        $response->assertOk();
    }
}
