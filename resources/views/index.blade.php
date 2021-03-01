<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Vinoreo</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    {{-- csrf token --}}
    <script>
        const csrf_token = '<?php echo csrf_token(); ?>';
    </script>
</head>
<body>
    <div id="root"></div>

    {{-- React JS --}}
    <script src="{{ asset('js/app.js') }}" defer></script>
</body>
</html>

