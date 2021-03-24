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
import { faShoppingBasket, fas } from "@fortawesome/free-solid-svg-icons";
import { fab, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas, fab);

import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import sanctumApi from "../../sanctum-api";
import DownShiftSearch from "./DownShiftSearch";
import { debounce } from "../../utilities/helpers";

const IndexNavbar = (props) => {
    const [navbarBg, setNavbarBg] = useState(false);
    const [categories, setCategories] = useState([]);

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);


    const handleScroll = debounce(() => {
        // use debounce help to reduce rerenders from scroll listener

        const currentScrollPos = window.pageYOffset;

        setVisible(
            prevScrollPos - currentScrollPos > 70 || // ensures navbar is shown only when swiping up more than 70px
                currentScrollPos < 10 //  ensures navbar is shown always at the verytop
        );

        setPrevScrollPos(currentScrollPos);

        window.scrollY >= 480 ? setNavbarBg(true) : setNavbarBg(false);
    }, 100);

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
        let isMounted = true;
        //transition effect dark/light and hide/show nav
        window.addEventListener("scroll", handleScroll);

        if (isMounted) {
            axios
                .get("/category-list")
                .then((res) => {
                    setCategories(res.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            isMounted = false;
        };
    }, [prevScrollPos, visible]);

    return (
        <nav
            className={`navbar navbar-expand-lg fixed-top
            ${navbarBg ? "navbar-light bg-light" : "navbar-dark bg-dark"}`}
            style={{ top: visible ? "0" : "-180px", transition: "top 0.6s" }}
        >
            <a className="navbar-brand" href="#">
                VINOREO
            </a>
            <div className="navbar-brand" id="product-search-form">
                <Form inline>
                    <DownShiftSearch />
                </Form>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
            >
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#Tequila">
                            Tequila
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#Whisky">
                            Whisky
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Ver todos
                        </a>
                        <div
                            className="dropdown-menu"
                            aria-labelledby="navbarDropdown"
                            id="category-dropdown"
                        >
                            {categories.map((category) => {
                                return (
                                    <a
                                        className="dropdown-item"
                                        key={category}
                                        href={`#${category}`}
                                    >
                                        {category}
                                    </a>
                                );
                            })}
                        </div>
                    </li>
                </ul>
                {/* right side of navbar */}
                <ul className="navbar-nav">
                    <li className="nav-item">
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
                    </li>
                    {props.userLogged && (
                        <li>
                            <NavDropdown
                                title={`${props.userInfo["userName"]}`}
                                id="collasible-nav-dropdown"
                            >
                                <NavDropdown.Item onClick={logout}>
                                    Cerrar sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>
                    )}
                </ul>
            </div>

            {/* floating btns */}
            <a
                href="https://wa.me/message/U6TWALXLFVMJF1"
                className="material-icons floating-btn-whats"
            >
                <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <Link to="/cart" className="material-icons floating-btn-cart">
                <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
                &nbsp;
                <Badge pill variant="warning">
                    {props.cartCount && props.cartCount}
                </Badge>
            </Link>
        </nav>
    );
};

export default withRouter(IndexNavbar);
