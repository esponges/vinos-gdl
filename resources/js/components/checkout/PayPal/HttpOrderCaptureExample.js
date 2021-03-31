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

const accessToken = document.head
    .querySelector('meta[name="paypaltoken"]')
    .getAttribute("content");
console.log(orderID, accessToken);

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
