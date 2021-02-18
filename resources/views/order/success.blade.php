<head>
    <title>{{ config('app.name', 'Vinoreo') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <div class="container">
    <div class="card" style="background-color:cadetblue; border-color:darkblue;">
        {{-- <img class="card-img-top" src="holder.js/100x180/" alt=""> --}}
        <div class="card-body">
            <h4 class="card-title">Gracias por tu compra</h4>
            <p class="card-text">Este es el resumen</p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($products as $product)
                        <tr>
                            <td scope="row">{{ $product->name }}</td>
                            <td>{{ $product->price }}</td>
                            <td>{{ $product->quantity }}</td>
                            <td>{{ $product->quantity * $product->price }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <p class="card-text"><b>Total de tu orden $ {{ $grandTotal }}</b></p>
            <p class="card-text"><b>Total Pagado $ </b> {{ $cartTotal }}</p>
            <p class="card-text mt-3"><b>Total a pagar en la entrega $ <u>{{ $balanceToPay }}</u></b> </p>
            <p class="card-text"><b>Orden N° </b> {{ $orderId }}</p>
            <p class="card-text"><b>Nombre </b> {{ $user->name }}</p>
            <p class="card-text"><b>Dirección de envio </b> {{ $order->address }}</p>
            <p class="card-text"><b>Detalles de la dirección </b> {{ $order->address_details ? $order->address_details : "n/d" }}</p>
            <a href="/" class="btn btn-primary">Ir a la página principal</a>
        </div>
    </div>
</div>

</body>

