import React, { useEffect, useState } from "react";
import {
    Button,
    Navbar,
    Form,
    Nav,
    FormControl,
    NavDropdown,
    Badge,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingBasket,
    faShoppingCart,
    fas,
} from "@fortawesome/free-solid-svg-icons";
import {
    fab,
    faInstagram,
    faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas, faShoppingCart, fab, faInstagram);

import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import sanctumApi from "../../sanctum-api";
import DownShiftSearch from "./DownShiftSearch";

const IndexNavbar = (props) => {
    const [navbar, setNavbar] = useState(false);
    const [products, setProducts] = useState("");

    const handleScroll = (e) => {
        if (window.scrollY >= 780) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    const logout = () => {
        sanctumApi
            .get("sanctum/csrf-cookie")
            .then(() => {
                axios
                    .post("/logout")
                    .then(() => {
                        console.log("logging out!!!");
                        props.logout();
                        props.history.push("/login");
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        //transition effect
        handleScroll();
        window.addEventListener("scroll", handleScroll);

        //remove event listener
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
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
                            <Badge
                                pill
                                variant="info"
                                size="sm"
                                id="item-count"
                            >
                                <FontAwesomeIcon icon={faShoppingBasket} />
                                &nbsp;{props.cartCount ?? props.cartCount}
                            </Badge>
                        </Link>

                        <Form inline>
                            <DownShiftSearch />
                        </Form>

                        {props.userLogged && (
                            <NavDropdown
                                title={`${props.userInfo[1]}`}
                                id="collasible-nav-dropdown"
                            >
                                <NavDropdown.Item onClick={logout}>
                                    Cerrar sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>

                {/* floating btns */}
                <a href="#" className="material-icons floating-btn-whats">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <Link to="/cart" className="material-icons floating-btn-cart">
                    <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
                    &nbsp;
                    <Badge pill variant="warning">
                        {props.cartCount && props.cartCount}
                    </Badge>
                </Link>

            </Navbar>
        </>
    );
};

export default withRouter(IndexNavbar);
