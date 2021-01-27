import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Jumbotron, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const Checkout = (props) => {
    const [phone, setPhone] = useState("Ingresa tu número telefónico");
    const [address, setAddress] = useState("");

    const pay = (e) => {
        e.preventDefault();
        axios.
        post('order/create', {
            address: address,
            payment_mode: 'paypal'
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        props.userInfo[3] && setPhone(props.userInfo[3]);
    })

    return (
        <div>
            {props.loggedIn ? (
                <div>
                    {/* use laravel form method */}
                    <Form className="mt-3" action="/order/create" method="post">
                        {/* place csrf token */}
                        <input type="hidden" value={csrf_token} name="_token" />
                        <input type="hidden" value="paypal" name="payment_mode" />
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Tu nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={`${props.userInfo[1]}`}
                                disabled
                            />
                            {/* <Form.Text className="text-muted">
                                Aquí te llegará tu confirmación
                            </Form.Text> */}
                            <Form.Label>Tu teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={`${phone}`}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            {/* <Form.Text className="text-muted">
                                Aquí te llegará tu confirmación
                            </Form.Text> */}
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
                                name="address"
                            />
                        </Form.Group>
                        {/* <Form.Group as={Col}>
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
                        </Form.Group> */}
                        <Button className="mb-5" variant="primary" type="submit">
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
