@component('mail::message')

Error en el pago con Paypal !!

Orden N°: {{ $order->id }}

Paypal Error: {{ $error['error'] }}


{{ config('app.name') }}
@endcomponent
