<?php

namespace App\Http\Controllers;

use App\Models\Order;
use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use Illuminate\Http\Request;
use Srmklive\PayPal\Facades\PayPal as PayPalClient;
use Srmklive\PayPal\Services\PayPal;
use Throwable;

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

            return response()->json(['id' => $paypalOrderId, 'status' => $paypalOrderStatus], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Error processing order ' . $order->id, 'order' => $order]);
        }
    }

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

            return response()->json($data, 200);
        } catch (ServerException $e) {

            if ($e->hasResponse()) {
                return response()->json([
                    'msg' => 'Server Exception',
                    'error' => json_decode($e->getResponse()->getBody()),
                ], 500);
            }
            return response()->json([
                'msg' => 'Server Exception',
                'request' => $e->getRequest(),
                $e->hasResponse() ? $e->getResponse() : ""
            ]);

            // return response()->json(['msg' => 'Client Error', 'error' => $e->getRequest()]);
        } catch (ClientException $e) {

            if ($e->hasResponse()) {
                return response()->json([
                    'msg' => 'Client Exception',
                    'error' => json_decode($e->getResponse()->getBody()),
                ], 400);
            }
            return response()->json([
                'msg' => 'Client Exception',
                'request' => $e->getRequest(),
                $e->hasResponse() ? $e->getResponse() : ""
            ]);
            // return response()->json(['msg' => 'Server Error', 'error' => report($e)]);
        } catch (BadResponseException $e) {

            if ($e->hasResponse()) {
                return response()->json([
                    'msg' => 'Uknown Exception',
                    'error' => json_decode($e->getResponse()->getBody()),
                ], 500);
            }
            return response()->json([
                'msg' => 'Uknown Exception',
                'request' => $e->getRequest(),
                $e->hasResponse() ? $e->getResponse() : ""
            ]);
        }
    }
}
