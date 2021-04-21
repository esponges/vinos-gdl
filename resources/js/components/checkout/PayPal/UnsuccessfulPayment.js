import React from "react";
import { Card, Button } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";

const UnsuccessfulPayment = (details) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Paypal falló en procesar tu pago</Card.Title>
                <Card.Text>
                    No te preocupes. <b>No se generó ningún cargo.</b>
                </Card.Text>
                <Card.Text>
                    Tu carrito sigue disponible para pago. Puedes reintentar con
                    PayPal u otro método.
                </Card.Text>
                <Link to="/cart/checkout">
                    <Button variant="primary">Reintentar pago</Button> <br />
                </Link>
                <Link to="/">
                    <Button variant="secondary" className="mt-4">
                        Página principal
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
};
export default UnsuccessfulPayment;
