import React from "react";
import { Form, Button, Row, Col, Jumbotron, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const Checkout = (props) => {
    return (
        <div>
            {console.log(props)}
            {props.loggedIn ? (
                <div>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa correo"
                            />
                            <Form.Text className="text-muted">
                                Aquí te llegará tu confirmación
                            </Form.Text>
                        </Form.Group>
                        <Form.Label>Tu CP</Form.Label>
                        <Form.Control as="select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Form.Control>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Dirección completa</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="La dirección de tu casa"
                            />
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label as="legend" column sm={2}>
                                Método de pago
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                    type="radio"
                                    label="Pago contra entrega"
                                    name="paymentType"
                                    id="cashPayment"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Pago con Paypal"
                                    name="paymentType"
                                    id="paypalPayment"
                                />
                            </Col>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Proceder a pago
                        </Button>
                    </Form>
                </div>
            ) : (
                <div>
                    <Jumbotron>
                        <h1>Regístrate</h1>
                        <ListGroup>
                            <ListGroup.Item>
                                Sólo necesitas un correo electrónico válido.
                            </ListGroup.Item>
                            <ListGroup.Item>
                                O si ya estás registrado, inicia sesión.
                            </ListGroup.Item>
                        </ListGroup>
                        <div className="container mt-3">
                            <Link to="/register">
                                <Button>Regístrate</Button> &nbsp;&nbsp;&nbsp;
                            </Link>
                            <Link to="/login">
                                <Button variant={"secondary"} size='sm'>
                                    Inicia sesión
                                </Button>
                            </Link>
                        </div>
                    </Jumbotron>
                </div>
            )}
        </div>
    );
};

export default Checkout;
