import axios from "axios";
import { Alert } from "react-bootstrap";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import sanctumApi from "../../sanctum-api";
import { withRouter, Link } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sessionError, setSessionError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(email, password, 'avedaaaa');
        setSessionError(false);
        sanctumApi
            .get("sanctum/csrf-cookie")
            .then(() => {
                axios
                    .post("login", {
                        email: email,
                        password: password,
                    })
                    .then((res) => {
                        if (res.status === 204 || 200) {
                            props.login();
                            if (props.cartCount > 0) {
                                props.history.push("/cart/checkout");
                                console.log('redirecting to checkout');
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
        <div className="container" style={{ marginTop: "13%" }}>
            {/* {console.log(props.cartCount)} */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Corre electrónico</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
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
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recordar usuario" />
                </Form.Group>
                {sessionError && (
                    <Alert variant={"warning"} className="m-5">Credenciales incorrectas</Alert>
                )}
                <Button variant="outline-primary" type="submit">
                    Iniciar sesión
                </Button>
                <Link to="/register">
                    <Button variant="primary" className="ml-5">Regístrate</Button>
                </Link>
            </Form>
        </div>
    );
};

export default withRouter(Login);
