@extends('layouts.checkout')

@section('content')

    <body>
        <div class="container mt-2">
            {{-- <img class="card-img-top" src="holder.js/100x180/" alt=""> --}}
            <h1 class="mb-2">Tuvimos problemas con tu compra</h4>
                <p class="mt-4"><b><em>No se te ha cobrado nada.</em> Puedes verificarlo en tu cuenta de Paypal.</b></p>
                <p class="mt-4"><b>Tu carrito sigue disponible</b></p>
                <p class="mt-4">Puedes volver a intentarlo</p>
                <a class="btn btn-primary mt-2 mb-2" href="/#/cart">Regresa al carrito</a>
                <a class="btn btn-primary mt2 mb-2 ml-2" href="/">Regresar al inicio</a>
        </div>
    </body>
@endsection
