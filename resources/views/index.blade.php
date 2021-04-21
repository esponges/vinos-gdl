<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VBF0D4HKYG"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-VBF0D4HKYG');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    {{-- SEO --}}
    <title>Vinoreomx</title>
    <meta name="description" content="Tienda online. Entrega gratis de vinos y licores a domicilio en Guadalajara. Precios de mayoreo con la mayor selección de tequila, whisky, gin, vodka y más.">

    @php

        $host = $_SERVER['SERVER_NAME'];
        // if ($host === '127.0.0.1') echo $host;

        /* PayPal Access Token with Srmk-Laravel */
        // use Srmklive\PayPal\Facades\PayPal as PayPalClient;
        // PayPalClient::setProvider();
        // $paypalProvider = PayPalClient::getProvider();
        // $paypalProvider->setApiCredentials(config('paypal'));
        // $access_token = $paypalProvider->getAccessToken()['access_token'];

    @endphp

    {{-- <meta name='paypaltoken' content ='{{ $access_token }}'> --}}

    <link type="text/css" href={{ $host == '127.0.0.1' ? asset('css/app.css') : '/css/app.css' }} rel="stylesheet">

    {{-- PayPal SDK --}}
    @php
        $paypal_link = "https://www.paypal.com/sdk/js?client-id=" . env('PAYPAL_SANDBOX_CLIENT_ID', "") . "&buyer-country=MX&currency=MXN"; // &debug=true
    @endphp
    <script src={{ $paypal_link }} defer></script>
</head>
<body>
    <div id="root"></div>

    {{-- React JS --}}
    <script src="js/app.js" defer></script>

</body>
</html>

