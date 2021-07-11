import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import sanctumApi from "../../sanctum-api";

const ForgotPassword = (props) => {
    const [email, setEmail] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [error, setError] = useState(false);
    // const [attemptSubmit, setAttemptSubmit] = useState("");

    const localhost = window.location.protocol + "//" + window.location.host; // set correct protocol for request http/localhost - https/live

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailSuccess(false);
        setError(false);

        sanctumApi
            .get('sanctum/csrf-cookie')
            .then(() => {
                axios({
                    baseURL: localhost,
                    method: 'POST',
                    url: '/password/email',
                    data: {
                        email: email
                    },
                })
                .then((res) => {
                    setEmailSuccess({'msg': 'Hemos enviado un correo electrónico de recuperación'});
                })
                .catch(() => {
                    setError({'msg': 'No existe ningún usuario con ese correo'});
                })
            })
            .catch(err => {
                setError({'msg': 'Tenemos problemas con el servidor.'});
            })
    }

    return (
        <div>
            <h3>Reestablece tu contraseña</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enviar correo de restablecimiento
                </Button>
                {emailSuccess &&
                    <Alert variant="success" className="mt-4">
                        {emailSuccess.msg}
                    </Alert>
                }
                {error &&
                    <Alert variant="warning" className="mt-4">
                        {error.msg}
                    </Alert>
                }
                <br />
                <Link to="/login">
                    <Button variant="outline-secondary" className="mt-4">
                        Regresar
                    </Button>
                </Link>
            </Form>
        </div>
    );
};

export default ForgotPassword;
