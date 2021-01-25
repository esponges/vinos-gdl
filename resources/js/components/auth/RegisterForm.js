import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import sanctumApi from "../../sanctum-api";

const RegisterForm = (props) => {
    const [name, setName] = useState("");
    // const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    // const [nameOk, setNameOk] = useState(false);
    // const [addressOk, setAddressOk] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submitting form");
        sanctumApi
            .get("sanctum/csrf-cookie")
            .then((res) => {
                console.log("response is", res);
                axios.post('register', {
                    name: name,
                    email: email,
                    password: password
                })
                .then(res => {
                    console.log('register is', res)
                })
                .catch(err => {
                    console.error(err, 'ya existe usuario!!!')
                })
            })
            .catch((err) => {
                console.error(err, 'problema con csrf');
            });
    };

    useEffect(() => {
        if (password === confirmPassword && password != "") {
            setPasswordsMatch(true);
        } else if (password != "" && password !== confirmPassword) {
            setPasswordsMatch(false);
        }
        // name.length > 8 ? setNameOk(true) : setNameOk(false);
        // address.length > 10 ? setAddressOk(true) : setNameOk(false);
        // }, [confirmPassword, name, address, passwordsMatch]);
    }, [confirmPassword]);

    return (
        <div className="container">
            {/* {console.log(props)} */}
            <Form>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tu nombre completo"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        El nombre con el que te ubican
                    </Form.Text>
                    {name != "" && name.length < 8 && (
                        <Alert variant={"warning"} className="m-1">
                            Ingresa correctamente la información
                        </Alert>
                    )}
                </Form.Group>
                {/* <Form.Group controlId="formBasicAddress">
                    <Form.Label>Tu dirección de entrega</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa dirección"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        ¿Dónde te entregamos?
                    </Form.Text>
                    {!addressOk && address != "" && (
                        <Alert variant={"warning"} className="m-1">
                            Ingresa correctamente la información
                        </Alert>
                    )}
                </Form.Group> */}
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
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingresa contraseña"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirma contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirma contraseña"
                        name="password_confirm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                {/* <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recordar usuario" />
                </Form.Group> */}
                {!passwordsMatch && password != "" && confirmPassword != "" && (
                    <Alert variant={"warning"} className="m-5">
                        Las contraseñas no coinciden
                    </Alert>
                )}
                {passwordsMatch && email != "" && name.length > 8 && (
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Regístrate
                    </Button>
                )}
                <Link to="/cart" className="btn btn-secondary">Regresar</Link>
            </Form>
        </div>
    );
};

export default RegisterForm;
