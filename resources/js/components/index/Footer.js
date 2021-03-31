import React from "react";
import { Button, Navbar, Form, Nav, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    fab,
    faInstagram,
    faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";

library.add(fab, faInstagram);

const Footer = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
            <div className="mr-auto">
                <Link to="/FAQ">Preguntas Frecuentes</Link> |&nbsp;
                <Link to="/about">Nosotros</Link>
            </div>
            <div>
                <a href="https://www.instagram.com/vinoreomx/">
                    <FontAwesomeIcon icon={faInstagram} color={"red"} />
                </a>
                &nbsp;&nbsp;&nbsp;
                <a href="https://www.facebook.com/vinoreomx">
                    <FontAwesomeIcon icon={faFacebook} />
                </a> &nbsp;
                <Link to="/legal">Legales</Link>
            </div>
        </nav>
    );
};

export default Footer;
