import axios from "axios";
import { Alert } from "react-bootstrap";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import sanctumApi from "../../sanctum-api";
import { withRouter } from "react-router";

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
                        if (res.status === 204) {
                            props.login();
                            if (props.cartCount > 0) {
                                props.history.push("/cart/checkout");
                                console.log('redirecting to checkout')
                            }
                            props.history.push("/cart");
                        } else {
                            console.log("not 204, delete cookies", res);
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
        <div className="container">
            {/* {console.log(props.cartCount)} */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
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
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default withRouter(Login);
