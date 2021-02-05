import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import LoginOrRegister from '../auth/LoginOrRegister';

const Checkout = (props) => {
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [addressDetails, setAddressDetails] = useState("");
    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
    const [addressAlertMessage, setAddressAlertMessage] = useState(null);

    useEffect(() => {
        props.userInfo[3] && setPhone(props.userInfo[3]);
    }, []);

    // validate
    useEffect(() => {
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
        if (address.length > 8 && phonePattern.test(phone) && phone.length == 10)
            setButtonIsActive(true);
        else setButtonIsActive(false);
    }, [address, phone]);


    // validate phone
    useEffect(() => {


    }, [phone]);

    return (
        <div>
            {props.loggedIn ? (
                <div>
                    {/* use laravel form method */}
                    <Form className="mt-3" action="/order/create" method="post">
                        {/* place csrf token */}
                        <input type="hidden" value={csrf_token} name="_token" />
                        <input
                            type="hidden"
                            value="paypal"
                            name="payment_mode"
                        />
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Tu nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={`${props.userInfo[1]}`}
                                disabled
                            />

                            <Form.Label className="mt-2">Tu teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ingresa tu teléfono"
                                value={phone && phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            {phoneAlertMessage && (
                                <Alert variant={"warning"} className="m-1">
                                    {phoneAlertMessage}
                                </Alert>
                            )}
                        </Form.Group>

                        <Form.Label>Tu CP</Form.Label>
                        <Form.Control as="select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Form.Control>

                        {/* address */}
                        <Form.Group controlId="formBasicPassword" className="mt-2">
                            <Form.Label>Calle y número exterior <i>(e interior si tienes)</i></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="La dirección de tu casa"
                                value={address}
                                name="address"
                                onChange={(e) => {setAddress(e.target.value)}}
                            />
                        </Form.Group>
                        {addressAlertMessage && (
                            <Alert variant={"warning"} className="m-1">
                                {addressAlertMessage}
                            </Alert>
                        )}

                        {/* more address info */}
                        <Form.Group controlId="formBasicPassword" className="mt-2">
                            <Form.Label>Opcional - Condominio, faccionamiento, o edificio <i>(detalles)</i></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Para dar más fácilmente contigo"
                                name="address_details"
                                value={addressDetails}
                                onChange={(e) => {setAddressDetails(e.target.value)}}
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
