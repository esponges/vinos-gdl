import React from 'react';
import { Button, Navbar, Form, Nav, FormControl, NavDropdown, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const IndexNavbar = () => {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top">
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
                            <NavDropdown.Item href="#Gin">
                                Gin
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#Ron">
                                Ron
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavItem style={{ marginRight: "10px" }}>
                            <Link to="/cart">Carrito</Link>
                        </NavItem>
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
}

export default IndexNavbar;
