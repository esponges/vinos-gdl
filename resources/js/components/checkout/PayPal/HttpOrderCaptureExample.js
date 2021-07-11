/* Order Capture via http request */

/* this into the head index.blade.tag */

// /* Paypal Access Token -- testing */
// \PayPal::setProvider();
// $paypalProvider = \PayPal::getProvider();
// $paypalProvider->setApiCredentials(config('paypal'));
// $access_token = $paypalProvider->getAccessToken();
// $paypalToken = $access_token['access_token'];

// <meta name='paypaltoken' content ='{{ $paypalToken }}'>

/* This goes into the OnApprove method */
/* You can also get the token by calling the back end, but in the end the token would be exposed... */

const accessToken = document.head
    .querySelector('meta[name="paypaltoken"]')
    .getAttribute("content");

/* Using front in Payment.js */
/* SUCCESS */
return axios
    .post(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
                "PayPal-Mock-Response":
                    '{"mock_application_codes":"INSTRUMENT_DECLINED"}',
            },
        }
    )
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.error(err);
    });

/* About getting response with Guzzle */

/* If I don't put the Guzzle request within a try catch the
$response will fail and wont answer and will throw a server error
with a message and a string, I could use that message to search
for the desired string 'INSTRUMENT_DECLINED' but thats works but
i don't think it's a good practice  */

$response = $client->request(
    'POST',
    'https://api-m.sandbox.paypal.com/v2/checkout/orders/' . $paypalOrderId . '/capture',
    [
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $access_token,
            // 'PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INTERNAL_SERVER_ERROR"]),
            'PayPal-Mock-Response' => json_encode(["mock_application_codes" => "INSTRUMENT_DECLINED"]),
        ],
    ],
);

/* This throws the 500 server error with the string */

/* using this logic */

if (stringInstrumentDeclined.search('INSTRUMENT_DECLINED') != -1) { // -1 is thrown when string is not found
    return actions.restart();
}
else console.log('didnt find it');

/* So I will have to use the front end option until
I get how to send a proper response from the back end */
