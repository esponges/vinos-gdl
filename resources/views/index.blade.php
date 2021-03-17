<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Vinoreo</title>
    @php
        $host = $_SERVER['SERVER_NAME'];
    @endphp
    <link type="text/css" href={{ $host == '127.0.0.1' ? asset('css/app.css') : '//css/app.css' }} rel="stylesheet">

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

