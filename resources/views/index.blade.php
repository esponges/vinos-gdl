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
    <meta name="description" content="Vino a domicilio con precio de mayoreo. Entrega en un día en Guadalajara">

    @php
        $host = $_SERVER['SERVER_NAME'];
        // if ($host === '127.0.0.1') echo $host;
    @endphp
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

