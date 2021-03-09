<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    @php
        $path = env('APP_ENV') == 'local' ? asset('css/app.css') : '/css/app.css';
    @endphp
    <link href="{{ $path }}" rel="stylesheet">
</head>

<body>
    @yield('content')
</body>

</html>
