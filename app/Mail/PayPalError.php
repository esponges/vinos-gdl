<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PayPalError extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $error;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($order, $error)
    {
        $this->order = $order;
        $this->error = $error;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.paypalPaymentError');
    }
}
