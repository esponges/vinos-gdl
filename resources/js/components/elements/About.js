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
            <ul id="about-ul">
                <h3 className="mt-4">¿Quiénes somos?</h3>
                <li>
                    Hola! <br /> Somos Fer y Tomás. Somos millenials y
                    treintones (¿ups?). Nos encanta pasar momentos divertidos
                    con la nuestra familia y con nuestros amigos acompañados de
                    un buen vino. Conocemos muy bien la industria de vinos y
                    licores, por lo que &nbsp;
                    <b>puedes estar tranquilo; te vamos a atender muy bien.</b>
                </li>
                <h3 className="mt-4">¿Qué buscamos?</h3>
                <li>
                    No nos parece justo que tengas que pagar precios inflados al
                    comprar tu vino a domicilio. Prepara con un día de
                    anticipación tu consumo y te podemos ayudar a ahorrar mucho
                    desde la comodidad de tu casa.
                </li>
                <h3 className="mt-4 mb-3">Nuestro compromiso</h3>
                <li>
                    <b>
                        Queremos que el vino sea la menor de tus preocupaciones
                    </b>
                    &nbsp; para
                    <ul id="about-ul">
                        <li>ese viaje o evento en puerta,</li>
                        <li>mantener bien llena la cava de tu hogar,</li>
                    </ul>
                    y, en general, hacer tus compras de vino a domicilio más{" "}
                    <em>baratas sin dejar de ser confiables.</em>
                </li>
            </ul>
            <h5 className="mb-3">
                <FontAwesomeIcon icon={faInfoCircle} />
                ¿Tienes dudas? Contáctanos a{" "}
                <a href="mailto: hola@vinoreo.mx">hola@vinoreo</a> o directo a
                nuestro Whatsapp/DM.
            </h5>
            <Link to="/">
                <Button variant={"primary"}>Regresar</Button>
            </Link>
        </div>
    );
};

export default About;
