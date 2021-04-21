import axios from "axios";
import { Link, withRouter } from "react-router-dom";

import React, { useEffect, useState, useRef, useContext } from "react";
import { Form, Button, Alert, Overlay, Tooltip } from "react-bootstrap";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fab);

import CheckCP from "../CheckCP";
import PaymentMode from "../PaymentMode";
import DeliverySchedule from "../DeliverySchedule";
import PaypalPayment from "../PaypalPayment";
import CustomLoader from "../../CustomLoader";

import { Context } from "../../Context";

const Checkout = (props) => {
    const [phone, setPhone] = useState("");
    const [orderName, setOrderName] = useState(`${props.userInfo["userName"]}`);
    const [CP, setCP] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [cartTotal, setCartTotal] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [streetName, setStreetName] = useState("");
    const [paymentMode, setPaymentMode] = useState("on_delivery");
    const [addressDetails, setAddressDetails] = useState("");
    const [deliveryDay, setDeliveryDay] = useState("");
    const [deliverySchedule, setDeliverySchedule] = useState("");

    const [orderInfo, setOrderInfo] = useState(null);

    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
    const [addressAlertMessage, setAddressAlertMessage] = useState(null);
    const [paymentModeReminder, setPaymentModeReminder] = useState(
        "on_delivery"
    );
    const [showPayPalBtn, setShowPayPalBtn] = useState(false);

    const [totalToPay, setTotalToPay] = useState(false);
    const [upfrontPayPalPayment, setUpfrontPayPalPayment] = useState("");

    const [show, setShow] = useState(false); // for Overlay Bootstrap element
    const target = useRef(null); // for Overlay Bootstrap element

    const [loader, setLoader] = useState(null);

    const context = useContext(Context);

    // from payment type radio input
    const handlePaymentChange = (e) => {
        console.log("payment_mode is", e.target.value);
        setPaymentMode(e.target.value);
        if (e.target.value === "paypal") setTotalToPay(`Total MX$${cartTotal}`);
        else if (e.target.value === "transfer")
            setTotalToPay(`Total MX$${cartTotal}`);
        else setTotalToPay(`Sub-total MX$${upfrontPayPalPayment}`);
    };

    const handleTransferSubmit = () => {
        setLoader(true);

        axios
            .post("/order/rest-api/create", {
                order_name: orderInfo.order_name,
                payment_mode: orderInfo.payment_mode,
                address: orderInfo.address,
                address_details: orderInfo.address_details,
                delivery_day: orderInfo.delivery_day,
                delivery_schedule: orderInfo.delivery_schedule,
                phone: orderInfo.phone,
                cp: orderInfo.cp,
                neighborhood: orderInfo.neighborhood,
                balance: orderInfo.balance,
            })
            .then((res) => {
                console.log(res.data);
                const vinoreoOrderID = res.data.orderID;

                axios.get(`/order/success/admin-email/${vinoreoOrderID}`);
                context.notifyToaster("success", "Orden creada exitosamente");
                setLoader(false);

                props.history.push(`/checkout/success/${vinoreoOrderID}`);
            })
            .catch((err) => {
                console.error(err);
                context.notifyToaster(
                    "warn",
                    "Tuvimos problemas creando tu orden :("
                );
            });
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
            if (
                streetName.length < 5 &&
                streetName != "" &&
                addressNumber.length != 0
            ) {
                setAddressAlertMessage("Por favor ingresa dirección completa");
            } else {
                setAddressAlertMessage(false);
            }

            // activate proceed button - must check due to async
            if (
                orderName != undefined &&
                phone.length == 10 &&
                streetName.length > 4 &&
                addressNumber.length > 0 &&
                phonePattern.test(phone) &&
                CP &&
                deliveryDay &&
                deliverySchedule
            ) {
                // show proper btn and pass info in case of paypal payment
                context.notifyToaster("info", "¡Información completa!");
                setButtonIsActive(true);
                setShowPayPalBtn(paymentMode !== "transfer" ? true : false);
                setOrderInfo({
                    order_name: orderName,
                    payment_mode: paymentMode,
                    address: `${streetName} #${addressNumber}`,
                    address_details: addressDetails,
                    delivery_day: deliveryDay,
                    delivery_schedule: deliverySchedule,
                    phone: phone,
                    cp: CP,
                    neighborhood: neighborhood,
                    balance:
                        paymentMode == "on_delivery" ? upfrontPayPalPayment : 0,
                });
            } else {
                setButtonIsActive(false);
                setShowPayPalBtn(false);
            }
            // remind user payment method
            paymentMode === "on_delivery" &&
                setPaymentModeReminder("Anticipo con PayPal");
            paymentMode === "transfer" &&
                setPaymentModeReminder(
                    "Pago del 100% por transferencia o depósito"
                );
            paymentMode === "paypal" &&
                setPaymentModeReminder("Pago del 100% por PayPal");
        }

        return () => (isMounted = false);
    }, [
        orderName,
        phone,
        CP,
        streetName,
        addressNumber,
        deliveryDay,
        deliverySchedule,
        addressDetails,
        paymentMode,
    ]);

    const totalHeader = <h3>{`Total MX$${cartTotal} `}</h3>;

    return (
        <div className="container">
            {!loader ? (
                props.loggedIn && cartTotal > 1500 ? (
                    <div>
                        {/* prompt user for payment method */}

                        {totalHeader && totalHeader}

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

                        <Form
                            className="mt-3 mb-5"
                            action="/order/create"
                            method="post"
                        >
                            <input
                                type="hidden"
                                value={paymentMode}
                                name="payment_mode"
                            />
                            <Form.Group>
                                <Form.Label>Tu nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={orderName}
                                    onChange={(e) =>
                                        setOrderName(e.target.value)
                                    }
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
                                    Sólo lo usaremos para mantenerte informado
                                    sobre tu orden
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
                                <Form.Label>Calle o avenida</Form.Label>
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
                                <input
                                    type="hidden"
                                    value={`${streetName} - ${addressNumber}`}
                                    name="address"
                                />
                            </Form.Group>
                            {addressAlertMessage && (
                                <Alert variant={"warning"} className="m-1">
                                    {addressAlertMessage}
                                </Alert>
                            )}

                            <DeliverySchedule
                                getDeliveryInfo={getDeliveryInfo}
                            />
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
                            {console.log(
                                buttonIsActive,
                                addressAlertMessage,
                                phone.length
                            )}
                            {!buttonIsActive &&
                                (addressAlertMessage || phone.length != 10) && (
                                    <Alert variant={"warning"} className="m-1">
                                        Por favor completa tu información
                                    </Alert>
                                )}
                            {totalHeader && totalHeader}
                            <p>
                                Tipo de pago: <b>{paymentModeReminder}</b>
                            </p>
                        </Form>
                    </div>
                ) : (
                    <div>
                        <Alert variant="warning">
                            Tu carrito de compras está vacío
                        </Alert>
                        <Link to="/">
                            <Button variant="primary">Regresar</Button>
                        </Link>
                    </div>
                )
            ) : (
                <CustomLoader />
            )}

            {/* show btns accordingly */}
            <div style={{ display: buttonIsActive ? "" : "none" }}>
                {showPayPalBtn ? (
                    <div>
                        {paymentMode === "on_delivery" && (
                            <Alert variant="info">
                                Se te cobrará <b>MX${upfrontPayPalPayment}</b> a
                                través de PayPal y el resto (MX$
                                {cartTotal - upfrontPayPalPayment}) lo debes de
                                liquidar <u>en efectivo</u> al recibir el pedido.
                            </Alert>
                        )}
                        <PaypalPayment
                            orderInfo={orderInfo}
                            setLoader={setLoader}
                            setShowPayPalBtn={setShowPayPalBtn}
                            setButtonIsActive={setButtonIsActive}
                        />
                    </div>
                ) : (
                    <Button
                        // className="mb-5"
                        variant="primary"
                        // disabled={buttonIsActive ? false : true}
                        onClick={handleTransferSubmit}
                    >
                        Generar orden
                    </Button>
                )}
            </div>
        </div>
    );
};

export default withRouter(Checkout);
