import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import sanctumApi from "../../sanctum-api";

const ForgotPassword = (props) => {
    const [email, setEmail] = useState("");
    const [emailSuccess, setEmailSuccess] = useState('await');
    const [attemptSubmit, setAttemptSubmit] = useState("");

    const localhost = window.location.protocol + "//" + window.location.host; // set correct protocol for request http/localhost - https/live

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email);
        setAttemptSubmit(true);

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
                    console.log('successfully sent link', res.data);
                    setEmailSuccess(true);
                })
                .catch((err) => {
                    console.error('problem sending link', err);
                    setEmailSuccess(false);
                })
            })
            .catch(err => {
                console.error('problem in sanctum cookie', err);
                setEmailSuccess(false);
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
                {attemptSubmit && emailSuccess &&
                    <Alert variant="success" className="mt-4">
                        Hemos enviado un link de restablecimiento a tu correo
                    </Alert>
                }
                {attemptSubmit && !emailSuccess &&
                    <Alert variant="warning" className="mt-4">
                        Tenemos problemas con el servidor, inténtalo más tarde por favor.
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
