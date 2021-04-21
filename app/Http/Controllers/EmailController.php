<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\Mail;
use App\Mail\TransferOrderConfirmation;
use App\Mail\AdminOrderConfirmationEmail;
use GuzzleHttp\Exception\BadResponseException;

class EmailController extends Controller
{
    public function prepareConfirmationEmails($order, $products, $paidWithPayPal, $grandTotal, $balanceToPay, $user, $paymentType)
    {
        // customer email
        if ($paymentType !== 'transfer') {
            Mail::to($user->email)->send(new ConfirmationEmail(
                $paidWithPayPal,
                $products,
                $grandTotal,
                $balanceToPay,
                $order,
            ));
        } else {
            Mail::to($user->email)->send(new TransferOrderConfirmation(
                $order,
                $products,
                $grandTotal,
                $balanceToPay,
            ));
        }

        // vinoreoEmail
        Mail::to('vinoreomx@gmail.com')->send(new AdminOrderConfirmationEmail(
            $order,
            $products,
            $grandTotal,
            $paidWithPayPal,
            $balanceToPay,
        ));
    }

    public function sendAdminEmails(Request $request)
    {
        $orderID = $request->orderID;
        $order = Order::find($orderID);
        $products = \Cart::getContent();
        $grandTotal = $order->total;

        if ($order->payment_mode === 'paypal') {
            $paidWithPayPal =  $order->total;
        } else if ($order->payment_mode === 'on_delivery') {
            $paidWithPayPal = $order->balance;
        } else {
            $paidWithPayPal = 0;
        }
        $balanceToPay = $grandTotal - $paidWithPayPal;

        // staff email
        $adminEmails = [
            'blancacarretero@vinosdivisa.com',
            'ventas@vinosdivisa.com',
            'jrodriguez@vinosdivisa.com',
            // 'spalafox@vinosdivisa.com',
        ];

        try {

            foreach ($adminEmails as $email) {
                Mail::to($email)->send(new AdminOrderConfirmationEmail(
                    $order,
                    $products,
                    $grandTotal,
                    $paidWithPayPal,
                    $balanceToPay,
                ));

                //clear cart
                \Cart::clear();
            }
        } catch (BadResponseException $ex) {

            //clear cart
            return $ex;
        }
    }
}
