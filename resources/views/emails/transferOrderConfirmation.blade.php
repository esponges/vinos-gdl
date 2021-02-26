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

Total a transferir o depositar: <b>{{$balanceToPay}}</b>

Tu N° de orden: <b>{{$order->id}}</b>

<b>Información de depósito/transferencia</b>

CLABE interbancaria <b>0123 2001 5371 445882</b><br>
N° de cuenta <b>153 714 4588</b><br>
N° de tarjeta <b>4152 3137 5497 2623</b><br>
Banco <b>BBVA</b><br><br>
Por favor envía tu comprobante de pago al Whatsapp <b>33 31 67 31 50</b> o al correo electrónico <b>hola@vinoreo.mx</b> para procesar tu envío
<br>

<b>Detalles de entrega</b>

Nombre del pedido: <b>{{$order->order_name}}</b><br>
Teléfono de contacto: <b>{{$order->phone}}</b><br>
Dirección de entrega: <b>{{$order->address}}</b><br>
Detalles de la dirección: <b>{{$order->address_details}}</b><br>
Colonia: <b>{{$order->neighborhood . " " . $order->cp}}</b><br>

<br>
<u>Una vez confirmada tu entrega:</u><br>
Día de entrega: <b>{{$order->delivery_day}}</b><br>
Horario aproximado de entrega: <b>{{$order->delivery_schedule}}</b><br>
<br>
<em>Si no se confirma tu pago para tu fecha deseada, ésta será reprogramada.</em> No te preocupes, nos pondremos en contacto contigo.
<br><br>
¡Disfrútalos!
{{ config('app.name') }}
@endcomponent
