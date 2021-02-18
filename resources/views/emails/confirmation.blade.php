@component('mail::message')
# Gracias por tu compra

El resumen de tu compra:
@component('mail::table')
| Producto       | Precio     | Cantidad         | Subtotal  |
| ------------- |:----------:|:-------------:| --------:|
@foreach ($products as $product)
| {{$product->name}}     | {{$product->price}} | {{$product->quantity}}      | {{$product->quantity * $product->price}}     |
@endforeach

@endcomponent

El total de tu compra fue: <b>{{$grandTotal}}</b>

Tu pago por Paypal: <b>{{$cartTotal}}</b>

Tu saldo a liquidar en la entrega: <b>{{$balanceToPay}}</b>

<br>
Detalles de entrega:

Nombre del pedido: <b>{{$user->name}}</b><br>
Dirección de entrega: <b>{{$order->address}}</b><br>
Detalles de la dirección: <b>{{$order->address_details}}</b><br>

{{-- @component('mail::button', ['url' => ''])
Button Text
@endcomponent --}}

¡Disfrútalos!<br>
{{ config('app.name') }}
@endcomponent
