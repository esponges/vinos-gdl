import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
    Form,
    Button,
    Alert,
    OverlayTrigger,
    Popover,
    Overlay,
    Tooltip,
} from "react-bootstrap";
import { fab, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fab);

import LoginOrRegister from "../auth/LoginOrRegister";
import CheckCP from "./CheckCP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DevilerySchedule from "./DevilerySchedule";
import PaymentMode from './PaymentMode';

const Checkout = (props) => {
    const [phone, setPhone] = useState("");
    const [orderName, setOrderName] = useState("");
    const [CP, setCP] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [cartTotal, setCartTotal] = useState("");
    const [upfrontPayPalPayment, setUpfrontPayPalPayment] = useState("");
    const [totalToPay, setTotalToPay] = useState(false);
    const [address, setAddress] = useState("");
    const [paymentMode, setPaymentMode] = useState("on_delivery");
    const [addressDetails, setAddressDetails] = useState("");
    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
    const [addressAlertMessage, setAddressAlertMessage] = useState(null);
    const [deliveryDay, setDeliveryDay] = useState("")
    const [deliverySchedule, setDeliverySchedule] = useState("");
    const [show, setShow] = useState(false); // for Overlay Bootstrap element
    const target = useRef(null); // for Overlay Bootstrap element

    // from payment type radio input
    const handlePaymentChange = (e) => {
        console.log(e.target.value);
        setPaymentMode(e.target.value);
        if (e.target.value === "paypal") setTotalToPay(`Total ${cartTotal} mxn`);
        else if (e.target.value === "transfer") setTotalToPay(`Total ${cartTotal} mxn`);
        else setTotalToPay(`Sub-total ${upfrontPayPalPayment} mxn`);
    };

    // validate CP
    const getCpInfo = (cpData) => {
        setCP(cpData.cp);
        setNeighborhood(cpData.name);
    };

    const getDeliveryInfo = (day, schedule) => {
        console.log(day, schedule);
        setDeliveryDay(day);
        setDeliverySchedule(schedule);
    }


    // get user info and cart total-subtotal
    useEffect(() => {
        props.userInfo['userPhone'] && setPhone(parseInt(props.userInfo['userPhone']));

        axios
            .get("/cart/get-total")
            .then((res) => {
                setCartTotal(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        axios
            .get("/cart/get-subtotal")
            .then((res) => {
                setUpfrontPayPalPayment(res.data); // 7% comission
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    // validations
    useEffect(() => {
        console.log("validations useEffect from Checkout.js");

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
        if (
            address.length > 8 &&
            phonePattern.test(phone) &&
            phone.length == 10 &&
            CP &&
            deliveryDay &&
            deliverySchedule
        )
            setButtonIsActive(true);
        else setButtonIsActive(false);
    }, [address, phone, CP, deliveryDay, deliverySchedule]);

    return (
        <div className="container mb-5">
            {props.loggedIn ? (
                <div style={{ marginTop: "18%" }}>
                    {/* prompt user for payment method */}
                    <h3>
                        {!totalToPay ? `Total ${cartTotal} mxn` : totalToPay}
                    </h3>

                    <PaymentMode handlePaymentChange={handlePaymentChange} upfrontPayPalPayment={upfrontPayPalPayment} />


                    {/* if user choses on_delivery */}
                    {paymentMode == "on_delivery" && (
                        <Alert variant={"warning"}>
                            Si eliges liquidar el saldo restante al recibir recuerda
                            que nuestro repartidor <u>sólo acepta efectivo</u>.
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
                                value={`${props.userInfo["userName"]}`}
                                onChange={(e) => setOrderName(e.target.value)}
                                name="order_name"
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

                        <Form.Group>

                            <Form.Label>Tu CP</Form.Label>
                            <CheckCP getCpInfo={getCpInfo} />
                            <input type="hidden" name="cp" value={CP}/>
                            <input type="hidden" name="neighborhood" value={neighborhood}/>


                            {/* Pop Over */}
                            <Button
                                variant="link"
                                ref={target}
                                onClick={() => setShow(!show)}
                            >
                                ¿No encuentras tu código postal?
                            </Button>
                            <Overlay
                                target={target.current}
                                show={show}
                                placement="top"
                            >
                                {(props) => (
                                    <Tooltip id="overlay-cp" {...props}>
                                        Significa que aún no llegamos a tu
                                        ubicación :(
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

                        <DevilerySchedule getDeliveryInfo={getDeliveryInfo} />
                        <input
                            type="hidden"
                            name="delivery_day"
                            value={deliveryDay}
                        />
                        <input
                            type="hidden"
                            name="delivery_schedule"
                            value={deliverySchedule}
                        />

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
                        <Button
                            className="mb-5"
                            variant="primary"
                            type="submit"
                            disabled={buttonIsActive ? false : true}
                        >
                            Proceder a pago
                        </Button>
                    </Form>
                </div>
            ) : (
                <LoginOrRegister className="container mt-2" />
            )}
        </div>
    );
};

export default Checkout;
