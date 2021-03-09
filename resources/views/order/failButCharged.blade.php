@extends('layouts.checkout')

@section('content')

    <body>
        <div class="container mt-2">
            {{-- <img class="card-img-top" src="holder.js/100x180/" alt=""> --}}
            <h1 class="mb-2">Tuvimos problemas confirmando el pago</h4>
                <p class="mt-4"><b>Por favor contacta a Vinoreo para aclarar el error a <a href="">hola@vinoreo.mx</a> o a nuestro whatsapp</b></p>
                <p class="mt-4">Por favor menciona <b>Tu número de orden: {{ $order->id }}</b> al ponerte en contacto con nosotros</p>
                <a class="btn btn-primary mt2 mb-2 ml-2" href="/">Regresar al inicio</a>
        </div>
    </body>
@endsection
