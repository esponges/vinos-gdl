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

const FAQ = () => {
    return (
        <div style={{ marginTop: "13%" }}>
            <ul id="about-ul">
                <h3 className="mt-4">Envíos</h3>
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
                <h3 className="mt-4">Pagos</h3>
                <p>Escoge el método de pago de tu preferencia:</p>
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
                    <b>Transferencia Bancaria:</b> Al
                    <em>checkout</em> de tu pedido recibirás la información
                    bancaria, y se te pedirá que envies tu comprobante a nuestro
                    Whatsapp o correo electrónico
                </li>
                <h3 className="mt-4">Siempre precios de Mayoreo</h3>
                <li>
                    <FontAwesomeIcon icon={faPercentage} color={"red"} />
                    Todos nuestros precios son siempre bajos, al seleccionar tu
                    producto puedes comparar el precio directamente la
                    competencia. La compra mínima es de $1,500 MXN.
                </li>
                    <h4 className="mt-5">Otras dudas</h4>
            </ul>

            <div className="container" id="faq-list-container">
                <ul>
                    <p id="faq-list-el">
                        <b>¿Por qué es tan barato?</b>
                    </p>
                    <li>
                        Estamos mal acostumbrados a pagar precios del súper o
                        tienda de conveniencia. Los precios en mayoreo llegan a
                        ser hasta un 20% abajo del precio de anaquel.{" "}
                    </li>
                    <b>
                        <p id="faq-list-el">¿Por qué pides compra mínima?</p>
                    </b>
                    <li>
                        Todos sabemos que para conseguir precios de mayoreo hay
                        que comprar volumen. ¿Vale la pena, no crees?
                    </li>
                    <b>
                        <p id="faq-list-el">¿El producto es confiable?</p>
                    </b>
                    <li>
                        Todos nuestros productos tienen su marbete (estampa QR
                        de hacienda con procedencia) y etiqueta indicando el
                        importador autorizado en México.{" "}
                    </li>
                    <b>
                        <p id="faq-list-el">
                            ¿Haces envíos fuera de Guadalajara?
                        </p>
                    </b>
                    <li>
                        Sí. Sólo que tienes que pagar el envío. Contáctanos para
                        más información a nuestro Whatsapp, DM en Instagram, o
                        correo electrónico.
                    </li>
                    <b>
                        <p id="faq-list-el">¿Manejas vinos de mesa?</p>
                    </b>
                    <li>
                        Tenemos las etiquetas más solicitadas en varios tipos de
                        uva. Chécalas arriba en la barra de navegación.
                    </li>
                </ul>

                <h5 className="mt-4 mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    ¿Tienes más dudas? Contáctanos a{" "}
                    <a href="mailto: hola@vinoreo.mx">hola@vinoreo</a> o directo
                    a nuestro Whatsapp
                </h5>

                <Link to="/">
                    <Button variant={"primary"}>Regresar</Button>
                </Link>
            </div>
        </div>
    );
};

export default FAQ;
