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
            <Navbar
                bg="light"
                variant="light"
                fixed="bottom"
                style={{ fontSize: "1rem" }}
            >
                {/* <Navbar.Brand href="#home">Vinoreo</Navbar.Brand> */}
                <Nav className="mr-auto">
                    {/* <Nav.Link href="#home">TyC</Nav.Link> */}
                    <Nav.Item>
                        <Link to="/about">Nosotros</Link> &nbsp;
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/login">Inicia Sesión</Link>
                    </Nav.Item>
                </Nav>
                <Nav>
                    <a href="https://www.instagram.com/vinoreomx/">
                        <em>Síguenos</em> &nbsp;
                        <FontAwesomeIcon icon={faInstagram} color={"red"} />
                    </a>
                    <a href="https://www.facebook.com/vinoreomx">
                        &nbsp;
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                </Nav>
            </Navbar>
        </>
    );
};

export default Footer;
