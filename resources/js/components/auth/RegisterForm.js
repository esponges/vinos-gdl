import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { Button, Form, Alert } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import CustomLoader from '../CustomLoader';

import sanctumApi from "../../sanctum-api";
import { Context } from '../Context';

const RegisterForm = (props) => {
    const [name, setName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [age, setAge] = useState(0);

    const [email, setEmail] = useState("");
    const [emailValidationAlert, setEmailValidationAlert] = useState(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [userDataIsValid, setUserDataIsValid] = useState(null);
    const [mktEmails, setMktEmails] = useState(true);

    const [isRegistered, setIsRegistered] = useState(null);
    const [error, setError] = useState(false);

    const [loader, setLoader] = useState(false);

    const localhost = window.location.protocol + "//" + window.location.host;

    const context = useContext(Context);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        const fullName = name + " " + familyName;
        // check if user is already registered
        axios({
            baseURL: localhost,
            method: 'GET',
            url: `/api/is-registered/${email}`
        })
            .then((res) => {
                // alert user already registered
                if (res.data.isRegistered) setIsRegistered(true);
                else {
                    setIsRegistered(false);
                    // proceed registering
                    sanctumApi
                        .get("sanctum/csrf-cookie")
                        .then((res) => {
                            axios({ baseURL: localhost,
                                    method: 'POST',
                                    url: '/register',
                                    data: {
                                        name: fullName,
                                        email: email,
                                        password: password,
                                        age: age,
                                        mkt_emails: mktEmails
                                    }
                            })
                                .then(() => {
                                    // if no error, log in user
                                    sanctumApi
                                        .get('sanctum/csrf-cookie')
                                        .then(() => {
                                            axios({
                                                baseURL: localhost,
                                                method: "POST",
                                                url: "/login",
                                                data: {
                                                    email: email,
                                                    password: password,
                                                    remember: 'on',
                                                },
                                            })
                                                .then((res) => {
                                                    props.login();
                                                    context.notifyToaster('success', 'Usuario registrado exitosamente');
                                                    setTimeout(props.history.push("/cart"), 3000);
                                                    // props.history.push("/login");
                                                })
                                                .catch((err) => {
                                                    console.error(err);
                                                    context.notifyToaster('warn', 'Tuvimos problemas con tu registro');
                                                    setLoader(false);
                                                });
                                        })
                                        .catch(err => {
                                            console.error('error with sanctum before login');
                                            context.notifyToaster('warn', 'Tuvimos problemas con tu registro');
                                            setLoader(false);
                                        })

                                })
                                .catch((err) => {
                                    console.error(err, "error registering user");
                                    context.notifyToaster('warn', 'Tuvimos problemas con tu registro');
                                    setLoader(false);
                                });
                        })
                        .catch((err) => {
                            console.error(
                                err,
                                "problem with csrf-cookie route"
                            );
                            context.notifyToaster('warn', 'Tuvimos problemas con tu registro');
                            setLoader(false);
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                context.notifyToaster('warn', 'Tuvimos problemas con tu registro');
                setLoader(false);
            });
    };

    // passwords
    const validatePasswords = async () => {
        if (password === confirmPassword && password != "") {
            await setPasswordsMatch(true);
        } else {
            await setPasswordsMatch(false);
        }
    };

    //validate email and password
    useEffect(() => {
        // email
        const pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        const emailRegExp = new RegExp(pattern);
        if (email)
            if (emailRegExp.test(email) && email != "") {
                setIsRegistered(false);
                setEmailValidationAlert(false);
            } else {
                setEmailValidationAlert("Por favor ingresa un correo válido");
            }

        validatePasswords();

        // both ok
        if (
            !emailValidationAlert &&
            name.length > 2 &&
            familyName.length > 4 &&
            password === confirmPassword &&
            password != ""
        ) {
            setUserDataIsValid(true);
        } else setUserDataIsValid(false);
    }, [email, confirmPassword, name, mktEmails]);

    return (
        <div className="container" style={{ marginTop: "13%" }}>
            {loader ? <CustomLoader /> : (
                <Form>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>
                            <b>Tu nombre </b>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tu nombre de pila"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Form.Text className="text-muted">
                            <b>Tu nombre de pila</b>
                        </Form.Text>
                        {name != "" && name.length < 3 && (
                            <Alert variant={"warning"} className="m-2">
                                Ingresa correctamente la información
                            </Alert>
                        )}
                    </Form.Group>
                    <Form.Group controlId="formBasicFamilyName">
                        <Form.Label>
                            <b>Apellido(s)</b>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tu(s) apellido(s)"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            required
                        />
                        {familyName != "" && familyName.length < 5 && (
                            <Alert variant={"warning"} className="m-2">
                                Ingresa correctamente la información
                            </Alert>
                        )}
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>
                            <b>Correo electrónico</b>{" "}
                        </Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {emailValidationAlert && (
                            <Alert variant={"warning"} className="m-2">
                                {emailValidationAlert}
                            </Alert>
                        )}

                        <Form.Label className="mt-4">
                            <b>
                                Tu edad <i>(opcional)</i>
                            </b>
                        </Form.Label>
                        <div className="row">
                            <div className="col-3">
                                <Form.Check
                                    type="radio"
                                    onClick={() => setAge(1)}
                                    label="18-25"
                                    name="age"
                                />
                            </div>
                            <div className="col-3">
                                <Form.Check
                                    type="radio"
                                    onClick={() => setAge(2)}
                                    label="26-35"
                                    name="age"
                                />
                            </div>
                            <div className="col-3">
                                <Form.Check
                                    type="radio"
                                    onClick={() => setAge(3)}
                                    label="36-45"
                                    name="age"
                                />
                            </div>
                            <div className="col-3">
                                <Form.Check
                                    type="radio"
                                    onClick={() => setAge(4)}
                                    label="+45"
                                    name="age"
                                />
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>
                            <b> Contraseña</b>
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa contraseña"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {!passwordsMatch &&
                        password != "" &&
                        confirmPassword != "" && (
                            <Alert variant={"warning"} className="m-2">
                                Las contraseñas no coinciden
                            </Alert>
                        )}
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>
                            <b>Confirma contraseña</b>
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirma contraseña"
                            name="password_confirm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Text className="text-muted success">
                        Nunca compartiremos tu información
                    </Form.Text>
                    <Form.Check
                        className="mb-2"
                        type="checkbox"
                        label="Deseo recibir ofertas exclusivas"
                        defaultChecked={mktEmails}
                        onChange={() => {
                            setMktEmails(!mktEmails);
                        }}
                    />
                    {isRegistered && (
                        <Alert variant={"warning"} className="m-2">
                            Este usuario ya está registrado
                        </Alert>
                    )}
                    {/* server error */}
                    {error && (
                        <Alert variant={"warning"} className="m-2">
                            Error en el servidor intenta en un momento
                        </Alert>
                    )}
                    {/* incomplete form */}
                    {!userDataIsValid && (
                        <Alert variant={"warning"} className="m-2">
                            Por favor completa toda la información
                        </Alert>
                    )}
                    <Button
                        variant="success"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={userDataIsValid ? false : true}
                    >
                        Regístrate
                    </Button>
                    <Link to="/cart" className="btn btn-secondary ml-3">
                        Regresar
                    </Link>{" "}
                    <br />
                </Form>
            )}
        </div>
    );
};

export default withRouter(RegisterForm);
