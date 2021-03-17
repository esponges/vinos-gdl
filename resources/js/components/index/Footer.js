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
                <Link to="/about">Nosotros</Link> &nbsp;
                <Link to="/login">Inicia Sesión</Link>
            </div>
            <div>
                <a href="https://www.instagram.com/vinoreomx/">
                    <em>Síguenos</em> &nbsp;
                    <FontAwesomeIcon icon={faInstagram} color={"red"} />
                </a>
                <a href="https://www.facebook.com/vinoreomx">
                    &nbsp;
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
            </div>
        </nav>
    );
};

export default Footer;
