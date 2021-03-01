import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    fas,
    faMoneyBillWaveAlt,
    faExchangeAlt,
    faShippingFast,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const About = () => {
    return (
        <div className="container" style={{ marginTop: "13%" }}>
            <h3 className="mt-2">Siempre precios de Mayoreo.</h3>
            <ul id="about-ul">
                <li>
                    Todos nuestros precios son siempre bajos, al seleccionar tu
                    producto puedes comparar el precio directamente la
                    competencia. La compra mínima es de $1,500 MXN.
                </li>
            </ul>
            <h3 className="mt-2">Envíos</h3>
            <ul id="about-ul">
                <li>
                    Recibe gratis al día siguiente{" "}
                    <FontAwesomeIcon icon={faShippingFast} /> en el horario que
                    elijas.
                </li>
                <li>
                    Al realizar tu pedido y pagar, tu orden llegará a la
                    dirección que indiques dentro de la Zona Metropolitana de
                    Guadalajara al día siguiente, o el día que selecciones.
                    Podrás elegir por períodos de dos horas (excepto sábados).
                </li>
                <li>
                    Por el momento no tenemos envíos fuera de la zona
                    metropolitana de Guadalajara.
                </li>
            </ul>
            <h3 className="mt-2">Pagos</h3>
            <p>Escoge el método de pago de tu preferencia:</p>
            <ul>
                <li>
                    <b>PayPal:</b> <FontAwesomeIcon icon={faPaypal} /> Realiza
                    el pago total de tu compra mediante PayPal con tu tarjeta de
                    crédito o débito.
                </li>
                <li>
                    <b>En efectivo al recibir: </b>
                    <FontAwesomeIcon icon={faMoneyBillWaveAlt} /> &nbsp; Paga
                    una pequeña cantidad del total de la compra por PayPal y
                    liquida el resto en efectivo al recibir tu orden.
                </li>
                <li>
                    <b>Transferencia Bancaria:</b> &nbsp;
                    <FontAwesomeIcon icon={faExchangeAlt} /> &nbsp; Al &nbsp;
                    <em>checkout</em> de tu pedido recibirás la información
                    bancaria, y se te pedirá que envies tu comprobante a nuestro
                    Whatsapp o correo electrónico
                </li>
            </ul>
            <h5>
                <FontAwesomeIcon icon={faInfoCircle} />
                ¿Tienes dudas? Contáctanos a{" "}
                <a href="hola@vinoreo.mx">hola@vinoreo</a> o directo a nuestro
                Whatsapp
            </h5>
            <Link to="/" className="mt-5">
                <Button variant={"primary"}>Regresar</Button>
            </Link>
        </div>
    );
};

export default About;
