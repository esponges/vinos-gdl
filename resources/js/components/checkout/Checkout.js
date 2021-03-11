import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import {
    Form,
    Button,
    Alert,
    Overlay,
    Tooltip,
} from "react-bootstrap";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fab);

import LoginOrRegister from "../auth/LoginOrRegister";
import CheckCP from "./CheckCP";
import PaymentMode from "./PaymentMode";
import DeliverySchedule from "./DeliverySchedule";
import PaypalPayment from "./PaypalPayment";
import { Context } from "../Context";

const Checkout = (props) => {
    const [phone, setPhone] = useState("");
    const [orderName, setOrderName] = useState("");
    const [CP, setCP] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [cartTotal, setCartTotal] = useState("");
    const [address, setAddress] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [streetName, setStreetName] = useState("");
    const [paymentMode, setPaymentMode] = useState("on_delivery");
    const [addressDetails, setAddressDetails] = useState("");
    const [deliveryDay, setDeliveryDay] = useState("");
    const [deliverySchedule, setDeliverySchedule] = useState("");

    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
    const [addressAlertMessage, setAddressAlertMessage] = useState(null);

    const [totalToPay, setTotalToPay] = useState(false);
    const [upfrontPayPalPayment, setUpfrontPayPalPayment] = useState("");

    const [csrfToken, setCsrfToken] = useState("");

    const [show, setShow] = useState(false); // for Overlay Bootstrap element
    const target = useRef(null); // for Overlay Bootstrap element

    const context = useContext(Context);

    // from payment type radio input
    const handlePaymentChange = (e) => {
        console.log(e.target.value);
        setPaymentMode(e.target.value);
        if (e.target.value === "paypal")
            setTotalToPay(`Total ${cartTotal} mxn`);
        else if (e.target.value === "transfer")
            setTotalToPay(`Total ${cartTotal} mxn`);
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
    };

    // get user info and cart total-subtotal
    useEffect(() => {
        let isMounted = true;

        // if phone info available set it
        props.userInfo["userPhone"] &&
            setPhone(parseInt(props.userInfo["userPhone"]));

        if (isMounted) {
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
        }

        return () => (isMounted = false);
    }, []);

    // validations
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
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
            console.log('streetname ', streetName.length, 'street name is ', streetName, 'address number len ', addressNumber.length, 'address num', addressNumber)
            if (streetName.length < 5 && streetName != "" &&
                addressNumber.length != 0
            ) {
                console.log('trueeeeeeeeeeee')
                setAddressAlertMessage("Por favor ingresa dirección completa");
            } else {
                console.log('falseeee')
                setAddressAlertMessage(false);
            }

            // activate proceed button - must check due to async
            if (
                streetName.length > 4 &&
                addressNumber.length > 0 &&
                phonePattern.test(phone) &&
                phone.length == 10 &&
                CP &&
                deliveryDay &&
                deliverySchedule
            )
            {
                setButtonIsActive(true);
            }
            else setButtonIsActive(false);
        }

        return () => isMounted = false;
    }, [addressNumber, streetName, phone, CP, deliveryDay, deliverySchedule]);

    useEffect(() => {
        let isMounted = true;

        if(isMounted) {
            axios
            .get('/api/csrf-token')
            .then((res) => {
                setCsrfToken(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
        }

        return () => isMounted = false;
    });

    return (
        <div className="container">
            {/* {console.log('this is in checkout ', context.cartContent)} */}
            {props.loggedIn ? (
                <div style={{ marginBottom: "6rem" }}>
                    {/* prompt user for payment method */}
                    <h3>
                        {!totalToPay ? `Total ${cartTotal} mxn` : totalToPay}
                    </h3>

                    <PaymentMode
                        handlePaymentChange={handlePaymentChange}
                        upfrontPayPalPayment={upfrontPayPalPayment}
                    />

                    {/* if user choses on_delivery */}
                    {paymentMode == "on_delivery" && (
                        <Alert variant={"warning"}>
                            Si eliges liquidar el saldo restante al recibir
                            recuerda que nuestro repartidor{" "}
                            <u>sólo acepta efectivo</u>.
                        </Alert>
                    )}

                    {/* use laravel form method */}
                    <Form className="mt-3 mb-5" action="/order/create" method="post">
                        {/* place csrf token */}
                        <input type="hidden" value={csrfToken} name="_token" />
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

                            <Form.Label className="mt-2">Email</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={true}
                                value={`${props.userInfo["userEmail"]}`}
                            />
                            <Form.Text className="text-muted success">
                                A este correo te enviaremos la confirmación
                            </Form.Text>

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
                            <Form.Text className="text-muted success">
                                Sólo lo usaremos para mantenerte informado sobre tu orden
                            </Form.Text>
                            {phoneAlertMessage && (
                                <Alert variant={"warning"} className="m-1">
                                    {phoneAlertMessage}
                                </Alert>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Tu Código Postal</Form.Label>
                            <CheckCP getCpInfo={getCpInfo} />
                            <input type="hidden" name="cp" value={CP} />
                            <input
                                type="hidden"
                                name="neighborhood"
                                value={neighborhood}
                            />

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
                                Calle o avenida
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="La dirección de tu casa"
                                value={streetName}
                                onChange={(e) => {
                                    setStreetName(e.target.value);
                                }}
                            />
                            <Form.Label>
                                Número exterior{" "}
                                <i>(e interior si tienes)</i>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="El número de la dirección"
                                value={addressNumber}
                                onChange={(e) => {
                                    setAddressNumber(e.target.value);
                                }}
                            />
                            <input type="hidden" value={`${streetName} - ${addressNumber}`} name="address" />
                        </Form.Group>
                        {addressAlertMessage && (
                            <Alert variant={"warning"} className="m-1">
                                {addressAlertMessage}
                            </Alert>
                        )}

                        <DeliverySchedule getDeliveryInfo={getDeliveryInfo} />
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
                    {/* <PaypalPayment /> */}
                </div>
            ) : (
                <LoginOrRegister className="container mt-2" />
            )}
        </div>
    );
};

export default Checkout;
