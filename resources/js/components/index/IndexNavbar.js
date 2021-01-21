import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
    Button,
    Navbar,
    Form,
    Nav,
    FormControl,
    NavDropdown,
    NavItem,
    Badge,
} from "react-bootstrap";
import {
    fas,
    faShoppingCart,
    faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
import axios from "axios";

const IndexNavbar = () => {
    const [itemCount, setItemCount] = useState(0);
    const [error, setError] = useState("");
    const [navbar, setNavbar] = useState(false);

    const handleScroll = (e) => {
        if (window.scrollY >= 780) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll);

        axios
            .get("/cart/count")
            .then((res) => {
                setItemCount(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Navbar
                collapseOnSelect
                expand="lg"
                bg={navbar ? "light" : "dark"}
                variant="light"
                fixed="top"
            >
                <Navbar.Brand href="#home">VINOREO</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#Tequila">Tequila</Nav.Link>
                        <Nav.Link href="#Whisky">Whisky</Nav.Link>
                        <NavDropdown
                            title="Más productos"
                            id="collasible-nav-dropdown"
                        >
                            <NavDropdown.Item href="#Vodka">
                                Vodka
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#Gin">Gin</NavDropdown.Item>
                            <NavDropdown.Item href="#Ron">Ron</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Link
                            to="/cart"
                            className="nav-link"
                            style={{ marginRight: "10px" }}
                        >
                            <b>Carrito</b> &nbsp;&nbsp;&nbsp;
                            <Badge pill variant="info" size="sm">
                                <FontAwesomeIcon icon={faShoppingBasket} />
                                &nbsp;{itemCount}
                            </Badge>
                        </Link>

                        <Form inline>
                            <FormControl
                                type="text"
                                placeholder="¿Qué buscas?"
                                className="mr-sm-2"
                            />
                            <Button variant="outline-primary">Buscar</Button>
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default IndexNavbar;
