import axios from "axios";
import { Alert } from "react-bootstrap";
import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import sanctumApi from "../../sanctum-api";
import { withRouter, Link } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sessionError, setSessionError] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const localhost = window.location.protocol + "//" + window.location.host; // set correct protocol for request http/localhost - https/live

    const handleSubmit = (e) => {
        e.preventDefault();

        setSessionError(false);

        sanctumApi
            .get("sanctum/csrf-cookie")
            .then(() => {
                axios({
                    baseURL: localhost,
                    method: "POST",
                    url: "/login",
                    data: {
                        email: email,
                        password: password,
                        remember: rememberMe ? "on" : "",
                    },
                })
                    .then((res) => {
                        if (res.status === 204 || 200) {
                            props.login();
                            if (props.cartCount > 0) {
                                props.history.push("/cart/checkout");
                            }
                            props.history.push("/cart");
                        } else {
                        }
                    })
                    .catch((err) => {
                        if (err.response.status === 401) {
                            return setSessionError({'msg': 'Credenciales incorrectas'});
                        };
                        setSessionError({'msg': 'Problemas con el servidor. Intenta más tarde.'});
                    });
            })
            .catch((err) => {
                console.error(err, "cookie");
            });
    };

    return (
        <div className="container">
            {!props.loggedIn ? (
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
                        <Form.Text className="text-muted">
                            Nunca compartiremos tu información
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check
                            type="checkbox"
                            label="Recordar usuario"
                            defaultChecked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                    </Form.Group>
                    {sessionError && (
                        <Alert variant={"warning"} className="mt-2 mb-4">
                            {sessionError.msg && sessionError.msg}
                        </Alert>
                    )}
                    <Button variant="primary" type="submit">
                        Iniciar sesión
                    </Button>
                    <Link to="/register">
                        <Button variant="outline-primary" className="ml-2">
                            Regístrate
                        </Button>
                    </Link>
                    <br />
                    <Link to="/forgot-password">
                        <Button variant="link" className="mt-2">
                            ¿Olvidaste tu contraseña?
                        </Button>
                    </Link>
                    <br />
                    <Link to="/">
                        <Button variant="outline-secondary" className="mt-2">
                            Regresar
                        </Button>
                    </Link>
                </Form>
            ) : (
                <Card style={{ maxWidth: "50%" }}>
                    <Card.Body>
                        <Card.Title className="mb-5">
                            <h2>Bienvenido a Vinoreo</h2>
                        </Card.Title>
                        <img
                            src="/img/check.jpg"
                            placeholder="session check"
                            style={{ maxWidth: "25%" }}
                        />
                        <Card.Text>Tu sesión está activa</Card.Text>
                        <Link to="/">
                            <Button variant="primary">Regresar</Button>
                        </Link>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default withRouter(Login);
