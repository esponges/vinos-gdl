<?php

namespace App\Models;

use App\Notifications\ResetPasswordCustomNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /* Fer. Overriding sendPasswordResetNotification to use custom email */
    /* https://laravel.com/docs/8.x/passwords#resetting-the-password */
    /* https://pineco.de/customizing-the-password-reset-email-in-laravel/ */
    /**
     * Send a password reset notification to the user.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $email = $this->getEmailForPasswordReset();

        // pass url with custom parameters token and email
        $host = $_SERVER['SERVER_NAME'];
        $url = $host !== 'vinoreo.mx'
            ? 'http://127.0.0.1:8000/password/reset/' . $token . '?email=' . $email
            : 'https://vinoreo.mx/password/reset/' . $token . '?email=' . $email;


        $this->notify(new ResetPasswordCustomNotification($url, $host));
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'mkt_emails'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
