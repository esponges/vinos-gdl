import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Alert, OverlayTrigger, Popover, Overlay, Tooltip } from "react-bootstrap";
import LoginOrRegister from '../auth/LoginOrRegister';
import CheckCP from "./CheckCP";

const Checkout = (props) => {
    const [phone, setPhone] = useState("");
    const [CP, setCP] = useState("");
    const [cartTotal, setCartTotal] = useState("");
    const [upfrontPayPalPayment, setUpfrontPayPalPayment] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMode, setPaymentMode] = useState('paypal');
    const [addressDetails, setAddressDetails] = useState("");
    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
    const [addressAlertMessage, setAddressAlertMessage] = useState(null);
    const [show, setShow] = useState(false); // for overlay
    const target = useRef(null); // for overlay

    // from payment type radio input
    const handleInputChange = (e) => {
        setPaymentMode(e.target.value);
    }

    // validate CP
    const getCP = (cpData) => {
        setCP(cpData);
    };

    // get user info and cart total-subtotal
    useEffect(() => {

        props.userInfo[3] && setPhone(props.userInfo[3]);

        axios
        .get("/cart/get-total")
        .then(res => {
            setCartTotal(res.data);
        })
        .catch(err => {
            console.error(err);
        });

        axios
        .get('/cart/get-subtotal')
        .then(res => {
            setUpfrontPayPalPayment(res.data); // 7% comission
        })
        .catch(err => {
            console.error(err);
        });

    }, []);

    // validations
    useEffect(() => {
        console.log('validations useEffect from Checkout.js');
        //validate phone
        const phonePattern = new RegExp(/^[0-9\b]+$/);
        if (phone) {
            if (phonePattern.test(phone)) {
                if (phone.length === 10) {
                    setPhoneAlertMessage(false);
                } else {
                    setPhoneAlertMessage(
                        "Por favor ingresa número de 10 dígitos"
                    );
                }
            } else {
                setPhoneAlertMessage("Por favor sólo ingresa números");
            }
        }
        //validate address
        if (address.length < 8 && address != "") {
            setAddressAlertMessage("Por favor ingresa dirección correcta");
        } else {
            setAddressAlertMessage(false);
        }

        // activate proceed button
        if (address.length > 8 && phonePattern.test(phone) && phone.length == 10 && CP)
            setButtonIsActive(true);
        else setButtonIsActive(false);
    }, [address, phone, CP]);

    return (
        <div className="container">
            {props.loggedIn ? (
                <div style={{ marginTop: "18%" }}>
                    {/* prompt user for payment method */}
                    <h3>
                        {paymentMode == "paypal"
                            ? `Total ${cartTotal}`
                            : `Subtotal ${upfrontPayPalPayment}`}{" "}
                        mxn
                    </h3>
                    <Alert variant={"success"}>
                        ¿Cómo deseas pagar?
                        <div className="row">
                            <div className="col-6">
                                <input
                                    type="radio"
                                    value={"paypal"}
                                    name="payment_mode"
                                    onClick={handleInputChange}
                                />
                                El total (100%) con PayPal
                            </div>
                            <div className="col-6">
                                <input
                                    type="radio"
                                    value={"on_delivery"}
                                    name="payment_mode"
                                    onClick={handleInputChange}
                                />
                                Paga un pequeño anticipo de{" "}
                                {Math.ceil(upfrontPayPalPayment)}mxn y paga el
                                restante en efectivo cuando recibas
                            </div>
                        </div>
                    </Alert>
                    {/* if user choses on_delivery */}
                    {paymentMode == "on_delivery" && (
                        <Alert variant={"warning"}>
                            Si eliges liquidar tu pago en la entrega recuerda
                            que nuestro repartidor <u>sólo acepta efectivo</u>
                        </Alert>
                    )}

                    {/* use laravel form method */}
                    <Form className="mt-3" action="/order/create" method="post">
                        {/* place csrf token */}
                        <input type="hidden" value={csrf_token} name="_token" />
                        <input
                            type="hidden"
                            value={paymentMode}
                            name="payment_mode"
                        />
                        <Form.Group>
                            <Form.Label>Tu nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={`${props.userInfo[1]}`}
                                disabled
                            />

                            <Form.Label className="mt-2">
                                Tu teléfono
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ingresa tu teléfono"
                                value={phone}
                                name="phone"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            {phoneAlertMessage && (
                                <Alert variant={"warning"} className="m-1">
                                    {phoneAlertMessage}
                                </Alert>
                            )}
                        </Form.Group>

                        {/* Pop Over */}
                        <Form.Group>
                            <Form.Label>Tu CP</Form.Label>
                                <CheckCP getCP={getCP} />
                                <Button variant="link" ref={target} onClick={() => setShow(!show)}>
                                    ¿No encuentras tu código postal?
                                </Button>
                                <Overlay target={target.current} show={show} placement="top">
                                    {(props) => (
                                        <Tooltip id="overlay-cp" {...props}>
                                            Significa que aún no llegamos a tu ubicación :(
                                        </Tooltip>
                                    )}
                                </Overlay>
                        </Form.Group>

                        {/* address */}
                        <Form.Group className="mt-2">
                            <Form.Label>
                                Calle y número exterior{" "}
                                <i>(e interior si tienes)</i>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="La dirección de tu casa"
                                value={address}
                                name="address"
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                }}
                            />
                        </Form.Group>
                        {addressAlertMessage && (
                            <Alert variant={"warning"} className="m-1">
                                {addressAlertMessage}
                            </Alert>
                        )}

                        {/* more address info */}
                        <Form.Group className="mt-2">
                            <Form.Label>
                                Opcional - Condominio, faccionamiento, o
                                edificio <i>(detalles)</i>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Para dar más fácilmente contigo"
                                name="address_details"
                                value={addressDetails}
                                onChange={(e) => {
                                    setAddressDetails(e.target.value);
                                }}
                            />
                        </Form.Group>

                        {/* let user pay if all information is set */}
                        {buttonIsActive && (
                            <Button
                                className="mb-5"
                                variant="primary"
                                type="submit"
                            >
                                Proceder a pago
                            </Button>
                        )}
                    </Form>
                </div>
            ) : (
                <LoginOrRegister className="container mt-2" />
            )}
        </div>
    );
};

export default Checkout;
