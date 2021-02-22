import React from "react";
import { Button, Navbar, Form, Nav, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";

library.add(fab, faInstagram);

const Footer = () => {
    return (
        <>
            <br />
            <Navbar bg="light" variant="light" fixed="bottom">
                {/* <Navbar.Brand href="#home">Vinoreo</Navbar.Brand> */}
                <Nav className="mr-auto">
                    <Nav.Link href="#home">TyC</Nav.Link>
                    <Nav.Link href="#features">KmxDesign</Nav.Link>
                    <Nav.Item>
                        <Link to="/login">Inicia Sesión</Link>
                    </Nav.Item>
                </Nav>
                <Nav>
                    <a href="#">
                        <em>Síguenos</em> {"       "}
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="#">
                        <em>{"        "} </em>
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                </Nav>
            </Navbar>
        </>
    );
};

export default Footer;
