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
    faPercentage,
} from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const About = () => {
    return (
        <div className="container" style={{ marginTop: "13%" }}>
            <h3 className="mt-2">Envíos</h3>
            <ul id="about-ul">
                <li>
                    Recibe gratis al día siguiente{" "}
                    <FontAwesomeIcon icon={faShippingFast} color={"orange"} />{" "}
                    en el horario que elijas.
                </li>
                <li>
                    Al realizar tu pedido y pagar, tu orden llegará a la
                    dirección que indiques dentro de la Zona Metropolitana de
                    Guadalajara al día siguiente, o el día que selecciones.
                    Podrás elegir por períodos de dos horas (excepto sábados).
                </li>
                <li>
                    Por el momento sólo tenemos envíos fuera de la zona
                    metropolitana de Guadalajara.
                </li>
            </ul>
            <h3 className="mt-2">Pagos</h3>
            <p>Escoge el método de pago de tu preferencia:</p>
            <ul>
                <li>
                    <FontAwesomeIcon icon={faPaypal} color={"blue"} /> &nbsp;
                    <b>PayPal:</b> Realiza el pago total de tu compra mediante
                    PayPal con tu tarjeta de crédito o débito.
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faMoneyBillWaveAlt}
                        color={"green"}
                    />{" "}
                    &nbsp;
                    <b>En efectivo al recibir: </b> Paga una pequeña cantidad
                    del total de la compra por PayPal y liquida el resto en
                    efectivo al recibir tu orden.
                </li>
                <li>
                    <FontAwesomeIcon icon={faExchangeAlt} color={"red"} />{" "}
                    &nbsp;
                    <b>Transferencia Bancaria:</b> Al &nbsp;
                    <em>checkout</em> de tu pedido recibirás la información
                    bancaria, y se te pedirá que envies tu comprobante a nuestro
                    Whatsapp o correo electrónico
                </li>
            </ul>
            <h3 className="mt-2">Siempre precios de Mayoreo</h3>
            <ul id="about-ul">
                <li>
                    Todos nuestros precios son siempre bajos{" "}
                    <FontAwesomeIcon icon={faPercentage} color={"red"} />, al
                    seleccionar tu producto puedes comparar el precio
                    directamente la competencia. La compra mínima es de $1,500
                    MXN.
                </li>
            </ul>
            <h5 className="mb-3">
                <FontAwesomeIcon icon={faInfoCircle} />
                ¿Tienes dudas? Contáctanos a{" "}
                <a href="mailto: hola@vinoreo.mx">hola@vinoreo</a> o directo a nuestro
                Whatsapp
            </h5>
            <Link to="/">
                <Button variant={"primary"}>Regresar</Button>
            </Link>
        </div>
    );
};

export default About;
