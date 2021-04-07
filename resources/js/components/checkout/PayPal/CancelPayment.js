import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CancelPayment = (params) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <b>Cancelaste el pago</b>{" "}
                </Card.Title>
                <Card.Text>
                    No te preocupes. Tu carrito sigue disponible para que lo
                    intentes nuevamente.
                </Card.Text>
                <div className="btn-group">
                    <Link to="/cart">
                        <Button variant="primary" className="mr-3">Regresa al carrito</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="secondary">Regresa al inicio</Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};
export default CancelPayment;
