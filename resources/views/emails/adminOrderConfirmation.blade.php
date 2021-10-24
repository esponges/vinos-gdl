@component('mail::message')
# Orden: <b>#{{$order['id']}}</b><br>

Resumen:
@component('mail::table')
| Producto       | Precio     | Cantidad         | Subtotal  |
| ------------- |:----------:|:-------------:| --------:|
@foreach ($products as $product)
| {{$product->name}}     | MX${{$product->price}} | {{$product->quantity}}      | MX${{$product->quantity * $product->price}}     |
@endforeach

@endcomponent

<b>Pago por&nbsp;&nbsp;
@if($order['payment_mode'] == "transfer")
Transferencia
@else
MercadoPago
@endif
</b>

Espera la confirmación del pago y horario por parte de Vinoreo.

@if($order['payment_mode'] == "full_MP")

<b>Pago por MercadoPago</b>

Espera la confirmación del pago y horario por parte de Vinoreo.

@endif



Total: MX$<b>{{$grandTotal}}</b>

@if($order['payment_mode'] == "paypal" || $order['payment_mode'] == "on_delivery")

Pago por Paypal: MX$<b>{{$paidWithPayPal}}</b>

@endif

@if($order['payment_mode'] == "on_delivery")

El cliente liquidará su orden en efectivo en la entrega.

Saldo por cobrar en la entrega: MX$<b>{{$balanceToPay}}</b>

@endif


<br>
Detalles de entrega: <br>

N° de Orden: <b>{{$order['id']}}</b><br>
Nombre del pedido: <b>{{$order['order_name']}}</b><br>
Teléfono del comprador: <b>{{$order['phone'] ? $order['phone'] : ""}}</b><br>
Dirección de entrega: <b>{{$order['address']}}</b><br>
Detalles de la dirección: <b>{{$order['address_details'] ? $order['address_details'] : 'No proporcionados'}}</b><br>
Colonia: <b>{{$order['neighborhood'] . " " . $order['cp']}}</b><br>

<br>
Día de entrega: <b>{{$order['delivery_day']}}</b><br>
Horario aproximado de entrega: <b>{{$order['delivery_schedule']}}</b>
@endcomponent
