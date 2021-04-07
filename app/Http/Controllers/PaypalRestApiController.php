<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Mail\ConfirmationEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Srmklive\PayPal\Services\PayPal;
use App\Mail\AdminOrderConfirmationEmail;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Exception\BadResponseException;
use Srmklive\PayPal\Facades\PayPal as PayPalClient;

class PaypalRestApiController extends Controller
{
    public function restApiCheckout(Request $request)
    {
        $order = Order::find($request->orderID);

        $paypalProvider = $this->setPaypalProvider();
        $purchase_units = $this->preparePurchaseUnits($order);

        try {
            $paypalOrder = $paypalProvider->createOrder($purchase_units);
            $paypalOrderId = $paypalOrder['id'];
            $paypalOrderStatus = $paypalOrder['status'];

            $this->storePaypalResponse($paypalOrder, 'createOrder');
            $order->paypal_id = $paypalOrderId;
            $order->save();

            return response()->json(['id' => $paypalOrderId, 'status' => $paypalOrderStatus], 200);
        } catch (BadResponseException $ex) {
            return response()->json(['error' => 'Error processing order ' . $order->id, 'order' => $order, 'exception' => $ex]);
        }
    }

    /**
     * getItemUnits
     * Fetch cart and prepare items as solicited by Paypal docs
     *
     * @param  mixed $order
     * @return array
     */
    public function getItemUnits($order)
    {

        $cart = \Cart::getContent();
        $paymentMode = $order->payment_mode;

        if ($paymentMode == "paypal") {
            $cartItems = array_map(function ($item) {
                return array(
                    'name' => $item['name'],
                    'sku' => $item['id'],
                    'unit_amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => $item['price'],
                    ),
                    'quantity' => $item['quantity'],
                );
            }, $cart->toArray(), []); // adding a second array will make index keys display correctly... lol
        } else {
            // if payment on_delivery only charge 7% and change item name
            $cartItems = array_map(function ($item) {
                return array(
                    'name' => 'Anticipo ' . $item['name'],
                    'sku' => $item['id'],
                    'unit_amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => ceil($item['price'] - ($item['price'] / 1.07)),
                    ),
                    'quantity' => $item['quantity'],
                );
            }, $cart->toArray(), []);
        }

        return $cartItems;
    }

    /**
     * preparePurchaseUnits
     *
     * @param  mixed $order
     * @return array
     */
    public function preparePurchaseUnits($order)
    {
        $totalToPay = $order->balance ? $order->balance : $order->total; // if payment == paypal, $order->balance == 0;

        $purchase_units = array(
            'intent' => 'CAPTURE',
            'purchase_units' =>
            array(
                0 =>
                array(
                    'reference_id' => $order->id,
                    'description' => 'Bebidas',
                    'custom_id' => 'Vinoreomx',
                    'amount' =>
                    array(
                        'currency_code' => 'MXN',
                        'value' => $totalToPay,
                        'breakdown' =>
                        array(
                            'item_total' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => $totalToPay,
                            ),
                            'shipping' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => 99,
                            ),
                            'shipping_discount' =>
                            array(
                                'currency_code' => 'MXN',
                                'value' => 99,
                            )
                        ),
                    ),
                    'items' => $this->getItemUnits($order),
                    'shipping' =>
                    array(
                        'method' => 'Vinoreo',
                        'name' =>
                        array(
                            'full_name' => $order->order_name
                        ),
                        'address' =>
                        array(
                            'address_line_1' => $order->address,
                            'address_line_2' => $order->address_details ?? '',
                            'admin_area_2' => $order->neighborhood,
                            'admin_area_1' => 'JAL',
                            'postal_code' => $order->cp,
                            'country_code' => 'MX',
                        ),
                    ),
                ),
            )
        );

        return $purchase_units;
    }

    public function captureOrder(Request $request)
    {
        // $paypalOrderId = $request->orderID;

        // $paypalProvider = $this->setPaypalProvider();
        // $options=['PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INSTRUMENT_DECLINED"])];

        // try {
        //     $response = $paypalProvider->capturePaymentOrder($paypalOrderId, $options);

        //     return response()->json($response, 200);
        // } catch (\Throwable $th) {

        //     return response()->json(['error' => 'error capturing order'], 400);
        // }

        $paypalOrderId = $request->orderID;
        PayPalClient::setProvider();
        $paypalProvider = PayPalClient::getProvider();
        $paypalProvider->setApiCredentials(config('paypal'));
        $access_token = $paypalProvider->getAccessToken()['access_token'];

        $client = new \GuzzleHttp\Client();

        // $response = $client->request(
        //     'POST',
        //     'https://api-m.sandbox.paypal.com/v2/checkout/orders/' . $paypalOrderId . '/capture',
        //     [
        //         'headers' => [
        //             'Content-Type' => 'application/json',
        //             'Authorization' => 'Bearer ' . $access_token,
        //             // 'PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INTERNAL_SERVER_ERROR"]),
        //             'PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INSTRUMENT_DECLINED"]),
        //         ],
        //     ],
        // );

        // $data = json_decode($response->getBody(), true);

        // return response()->json($data, 200);

        try {
            $response = $client->request(
                'POST',
                'https://api-m.sandbox.paypal.com/v2/checkout/orders/' . $paypalOrderId . '/capture',
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer ' . $access_token,
                        // 'PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INTERNAL_SERVER_ERROR"]),
                        // 'PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INSTRUMENT_DECLINED"]),
                    ],
                ],
            );
            $data = json_decode($response->getBody(), true);

            $this->storePaypalResponse($data, 'captureOrder');

            //prepare email data
            $order = Order::where('paypal_id', $request->orderID)->first();
            $products = \Cart::getContent();
            $paidWithPayPal = $order->balance;
            $grandTotal = \Cart::getTotal();
            $balanceToPay = $grandTotal - $paidWithPayPal;
            $user = auth()->user();

            /* success email for user and staff */
            $this->prepareConfirmationEmails($order, $products, $paidWithPayPal, $grandTotal, $balanceToPay, $user);

            //clear cart

            /* front end response */
            return response()->json([$data, 'vinoreo_orderID' => $order->id], 200);

        } catch (ServerException $e) {

            if ($e->hasResponse()) {
                $response = json_decode($e->getResponse()->getBody());
                $this->storePaypalResponse($response, 'captureOrderServerException');

                return response()->json([
                    'msg' => 'Server Exception',
                    'error' => $response,
                ], 500);
            }

            $response = json_decode($e->hasResponse() ? $e->getResponse() : "");
            $this->storePaypalResponse($response, 'captureOrderServerException');

            return response()->json([
                'msg' => 'Server Exception',
                'request' => $e->getRequest(),
                'error' => $response,
            ]);

        } catch (ClientException $e) {

            if ($e->hasResponse()) {
                $response = json_decode($e->getResponse()->getBody());
                $this->storePaypalResponse($response, 'captureOrderClientException');

                return response()->json([
                    'msg' => 'Client Exception',
                    'error' => $response,
                ], 400);
            }
            $response = json_decode($e->hasResponse() ? $e->getResponse() : "");
            $this->storePaypalResponse($response, 'captureOrderClientException');

            return response()->json([
                'msg' => 'Client Exception',
                'request' => $e->getRequest(),
                'error' => $response,
            ]);

        } catch (BadResponseException $e) {

            if ($e->hasResponse()) {
                $response = json_decode($e->getResponse()->getBody());
                $this->storePaypalResponse($response, 'captureOrderGeneralException');

                return response()->json([
                    'msg' => 'Uknown Exception',
                    'error' => $response,
                ], 500);
            }

            $response = json_decode($e->hasResponse() ? $e->getResponse() : "");
            $this->storePaypalResponse($response, 'captureOrderGeneralException');

            return response()->json([
                'msg' => 'Uknown Exception',
                'request' => $e->getRequest(),
                'error' => $response,
            ]);
        }
    }

    /**
     * setPaypalProvider
     * set Client PayPalClientCredentials from package
     * @return mixed
     */
    public function setPaypalProvider()
    {
        PayPalClient::setProvider();
        $paypalProvider = PayPalClient::getProvider();
        $paypalProvider->setApiCredentials(config('paypal'));
        $access_token = $paypalProvider->getAccessToken();
        $paypalProvider->setAccessToken($access_token);
        return $paypalProvider;
    }

    public function storePaypalResponse($response, $type)
    {
        DB::table('paypal_response')->insert([
            'body' => json_encode($response),
            'type' => $type,
            'user_id' => auth()->user()->id,
        ]);
    }

    public function prepareConfirmationEmails($order, $products, $paidWithPayPal, $grandTotal, $balanceToPay, $user)
    {
        // customer email
        Mail::to($user->email)->queue(new ConfirmationEmail(
            $paidWithPayPal,
            $products,
            $grandTotal,
            $balanceToPay,
            $order,
        ));

        // staff email
        $adminEmails = [
            'vinoreomx@gmail.com',
            'ventas@vinosdivisa.com',
            // 'spalafox@vinosdivisa.com',
            'jrodriguez@vinosdivisa.com',
            'blancacarretero@vinosdivisa.com',
        ];

        foreach ($adminEmails as $email) {
            sleep(1);
            Mail::to($email)->queue(new AdminOrderConfirmationEmail(
                $order,
                $products,
                $grandTotal,
                $paidWithPayPal,
                $balanceToPay,
            ));
        }
    }
}
