@extends('layouts.checkout')

@section('content')
    <body>
        <div class="container mt-2">
            {{-- <img class="card-img-top" src="holder.js/100x180/" alt=""> --}}
                <p>Confirmación de la orden <b>#{{$order['id']}}</b></p>
                <p class="mt-4"><b>Resumen de compra</b></p>
                <table class="table mt-2 mb-2">
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
                                <td scope="row">{{ $product['name'] }}</td>
                                <td>{{ $product['price'] }}</td>
                                <td>{{ $product['quantity'] }}</td>
                                <td>{{ $product['quantity'] * $product['price'] }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <p class="mt-4">Orden N° <b>{{ $order['id'] }}</b> </p>
                <p><b>Total de tu orden $ {{ $grandTotal }}</b></p>
                <p><b>Total Pagado $ </b> {{ $cartTotal }}</p>
                <h5 class="mt-3"><b>Total a pagar
                    {{$order['payment_mode'] === 'transfer'
                        ? '' : 'contra entrega'
                    }}
                <u>{{ $balanceToPay }}</u></b> mxn</h5><br>

                @if ($order['payment_mode'] === "on_delivery")

                <u>Recuerda que el repartidor sólo recibe efectivo</u>

                @endif

                @if ($order['payment_mode'] === "transfer")
                    <div class="jumbotron jumbotron-fluid mt-2" id="transfer-success-blade-jumbo">
                        <div class="container">
                            <h3>Información de depósito/transferencia</h3>
                            <ul style="list-style: none">
                            <li>CLABE interbancaria <b>0723 2000 3244 528134</b><br></li>
                            <li>Nombre <b>Licoret Occidental SA de CV</b></li>
                            <li>N° de cuenta <b>032 445 2813</b><br></li>
                            <li>Banco <b>Banorte</b><br><br></li>
                            </ul>
                            <p>Por favor envía tu comprobante de pago junto a tu número de orden al Whatsapp
                                <b>33 23 63 33 43</b>
                                o al correo electrónico
                                <b>hola@vinoreo.mx</b>
                                &nbsp;para procesar tu envío
                            </p>
                        </div>
                    </div>

                    <p class="mt-2 mb-5"><em>Si no se confirma tu pago para tu fecha  de entrega deseada, ésta será reprogramada.</em> No te preocupes, nos pondremos en contacto contigo.</p>
                @endif

                <p class="card-text mt-4">Nombre <b>{{ $order['order_name'] }}</b> </p>
                <p>Teléfono de contacto: <b>{{ $order['phone'] }}</b></p>
                <p>Dirección de envio<b> {{ $order['address'] }}</b> </p>
                <p>Detalles de la dirección<b> {{ $order['address_details'] ? $order['address_details'] : "n/d" }} </b></p>
                <p>Colonia<b>&nbsp;{{$order['neighborhood'] . " " . $order['cp']}}</b></p><br>
                <p>Día de entrega<b>&nbsp;{{$order['delivery_day']}}</b></p>
                <p class="card-text mb-4">Horario aproximado de entrega<b>&nbsp;{{$order['delivery_schedule']}}</b></p>
                <a href="/" class="btn btn-primary">Página principal</a>
        </div>
    </body>
@endsection

