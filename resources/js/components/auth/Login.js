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
    const [rememberMe, setRememberMe] = useState("off");
    const [checked, setChecked] = useState(false);

    // const localhost = window.location.protocol + "//" + window.location.host;

    const handleSubmit = (e) => {
        e.preventDefault();

        let rememberMe = checked ? 'on' : '';

        setSessionError(false);

        sanctumApi
            .get("sanctum/csrf-cookie")
            .then(() => {
                axios
                    .post("login", {
                        email: email,
                        password: password,
                        remember: rememberMe,
                    })
                    .then((res) => {
                        if (res.status === 204 || 200) {
                            props.login();
                            if (props.cartCount > 0) {
                                props.history.push("/cart/checkout");
                                console.log("redirecting to checkout");
                            }
                            props.history.push("/cart");
                        } else {
                            console.log("not 200 or 204, delete cookies");
                        }
                    })
                    .catch((err) => {
                        console.error(err, "error de inicio de sesión");
                        setSessionError(true);
                    });
            })
            .catch((err) => {
                console.error(err, "cookie");
            });
    };

    return (
        <div className="container" style={{ marginTop: "15%" }}>
            {/* {console.log(localhost)} */}
            {!props.loggedIn ? (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa to correo"
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
                            defaultChecked={checked}
                            onChange={() => setChecked(!checked)}
                        />
                    </Form.Group>
                    {sessionError && (
                        <Alert variant={"warning"} className="m-5">
                            Credenciales incorrectas
                        </Alert>
                    )}
                    <Button variant="primary" type="submit">
                        Iniciar sesión
                    </Button>
                    <Link to="/register">
                        <Button variant="outline-primary" className="ml-5">
                            Regístrate
                        </Button>
                    </Link>
                </Form>
            ) : (
                <Card style={{ maxWidth: "50%" }}>
                    <Card.Body>
                        <Card.Title className="mb-5">
                            Bienvenido a Vinoreo
                        </Card.Title>
                        <img
                            src="/img/check.jpg"
                            placeholder="session check"
                            style={{ maxWidth: "50%" }}
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
