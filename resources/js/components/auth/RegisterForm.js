import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const RegisterForm = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(null);

    const passwordCompare = (e) => {
        // e.preventDefault();
        console.log('compare')
        setConfirmPassword(e.target.value);
        if (password === confirmPassword) {
            setPasswordsMatch(true);
            console.log('passwords match bro!!')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitting form brooooo')
    }


    return (
        <div className="container">
            {/* {console.log(props)} */}
            <Form onSubmit={(e) => handleSubmit}>
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
                        type="text"
                        placeholder="Confirma contraseña"
                        name="password_confirm"
                        value={confirmPassword}
                        onChange={(e) => passwordCompare}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recordar usuario" />
                </Form.Group>
                {passwordsMatch && (
                    <Alert variant={"warning"} className="m-5">
                        Las contraseñas no coinciden
                    </Alert>
                )}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default RegisterForm;
