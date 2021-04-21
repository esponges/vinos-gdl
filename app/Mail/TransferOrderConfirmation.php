<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TransferOrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $products;
    public $grandTotal;
    public $balanceToPay;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        $order,
        $products,
        $grandTotal,
        $balanceToPay
    )
    {
        $this->order = $order;
        $this->products = $products;
        $this->grandTotal = $grandTotal;
        $this->balanceToPay = $balanceToPay;

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
        ->subject('Vinoreo: confirmación de orden')
        ->markdown('emails.transferOrderConfirmation');
    }
}
