import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, ListGroup, Button } from 'react-bootstrap';

const loginOrRegister = () => {

    return (
        <div>
            <Jumbotron className="container mt-4">
                <h1>Regístrate</h1>
                <ListGroup>
                    <ListGroup.Item>
                        Sólo necesitas un correo electrónico válido.
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Si ya estás registrado, inicia sesión.
                    </ListGroup.Item>
                </ListGroup>
                <div className="container mt-3">
                    <Link to="/register">
                        <Button variant={"primary"}>Regístrate</Button> &nbsp;&nbsp;&nbsp;
                    </Link>
                    <Link to="/login">
                        <Button variant={"outline-primary"} size="sm">
                            Inicia sesión
                        </Button>
                    </Link>
                </div>
            </Jumbotron>
        </div>
    );
}

export default loginOrRegister;
