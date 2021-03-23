@component('mail::message')
# Hola

Accede al link de abajo para reestablecer tu contraseña,

@component('mail::button', ['url' => $url])
Reestablece tu contraseña
@endcomponent

Este link tiene una duración de 60 minutos.

Si tu no solicitaste esto, contáctanos por MD or Whatsapp.

Gracias,<br>
{{ config('app.name') }}
<br>
{{ $host }}
@endcomponent
