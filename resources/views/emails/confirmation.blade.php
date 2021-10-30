@component('mail::message')
# Gracias por tu compra

El resumen de tu compra:
@component('mail::table')
| Producto       | Precio     | Cantidad         | Subtotal  |
| ------------- |:----------:|:-------------:| --------:|
@foreach ($products as $product)
| {{$product->name}}     | MX${{$product->price}} | {{$product->quantity}}      | MX${{$product->quantity * $product->price}}     |
@endforeach

@endcomponent

El total de tu compra fue: MX$<b>{{$grandTotal}}</b>

@if ($order['payment_mode'] !== 'transfer')

Pago por <b>MercadoPago</b>.

Te contactaremos para mandarte un link de pago seguro.

@endif

@if ($order['payment_mode'] == "on_delivery")

Tu saldo a liquidar en la entrega: MX$<b>{{$balanceToPay}}</b>

<u>Recuerda que el repartidor sólo recibe efectivo</u>

@endif


<br>
Detalles de entrega: <br>

Nombre del pedido: <b>{{$order['order_name']}}</b><br>
Teléfono del comprador <b>{{$order['phone'] ? $order['phone'] : ""}}</b><br>
Dirección de entrega: <b>{{$order['address']}}</b><br>
Detalles de la dirección: <b>{{ $order['address_details'] ? $order->address_details : 'No proporcionados' }}</b><br>
Colonia: <b>{{$order['neighborhood'] . " " . $order['cp']}}</b><br>

<b>El pedido será programado una vez realizado tu pago.</b>

<br>
Día de entrega: <b>{{$order['delivery_day']}}</b><br>
Horario aproximado de entrega: <b>{{$order['delivery_schedule']}}</b>

{{-- @component('mail::button', ['url' => ''])
Button Text
@endcomponent --}}

¡Disfrútalos!<br>
{{ config('app.name') }}
@endcomponent
