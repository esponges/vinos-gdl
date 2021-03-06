<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmationEmail extends Mailable
{
    public $cartTotal;
    public $products;
    public $grandTotal;
    public $balanceToPay;
    public $order;

    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        $cartTotal,
        $products,
        $grandTotal,
        $balanceToPay,
        $order
        )
    {
        $this->cartTotal = $cartTotal;
        $this->products = $products;
        $this->grandTotal = $grandTotal;
        $this->balanceToPay = $balanceToPay;
        $this->order = $order;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
        ->from('confirmation@vinoreomx.com')
        ->subject('Vinoreo: confirmación de pago')
        ->markdown('emails.confirmation');
    }
}
