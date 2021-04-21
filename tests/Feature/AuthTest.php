<?php

namespace Tests\Feature;

use App\Models\Cp;
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
            'mkt_emails' => Factory::create()->randomElement([true, false, NULL]),
            // 'mkt_emails' => true,
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
            'password' => 'tomasito',
            'remember' => 'on'
        ]);

        // $response->getStatusCode();
        // $response->dumpHeaders();
        // $response->dump();
        $response->assertStatus(302);
        $this->assertAuthenticated();
    }

    public function test_incorrect_credentials()
    {
        $this->withoutExceptionHandling();

        // $user = User::first();
        $user = User::first();
        // dd($user);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'incorrectcred',
            'remember' => 'on'
        ]);

        // $response->getStatusCode();
        // $response->dumpHeaders();
        // $response->dump();
        $response->assertStatus(401);
        // $this->assertAuthenticated();
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

    public function test_isAuth_truthy()
    {
        $this->withoutExceptionHandling();

        $response = $this->actingAs(User::first())->get('/api/is-auth');

        $this->assertEquals($response->original, true);
    }

    public function test_isAuth_falsy()
    {
        $this->withExceptionHandling();

        $response = $this->get('/api/is-auth');

        $this->assertEquals($response->original, false);
    }

    public function test_get_userInfo()
    {
        $this->withoutExceptionHandling();

        $response = $this->actingAs(User::first())->get('/api/user-info');

        $userInfo = [];

        $userInfo['userName'] = auth()->user()->name;
        $userInfo['userPhone'] = auth()->user()->phone;
        $userInfo['userEmail'] = auth()->user()->email;

        $response->assertOk();
        $response->assertJsonFragment($userInfo);
    }

    public function test_get_userInfo_not_auth()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/api/user-info');

        $response->assertOk();
        $this->assertEquals($response->original, ['error' => 'user not logged in']);
    }

    public function test_get_CP()
    {
        $this->withoutExceptionHandling();

        $response = $this->get('/api/get-CP');

        $response->assertOk();

        $cp = Cp::all()->toArray();
        $response->assertJson($cp);
    }

    public function test_getCSRFToken()
    {
        $this->withoutExceptionHandling();
        $this->withoutMiddleware();

        $response = $this->actingAs(User::first())->get(route('csrf-token'));

        $response->assertOk();
    }

}
