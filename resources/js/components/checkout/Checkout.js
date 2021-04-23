import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Form, Button, Alert, Overlay, Tooltip } from "react-bootstrap";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fab);

import LoginOrRegister from "../auth/LoginOrRegister";
import CheckCP from "./CheckCP";
import PaymentMode from "./PaymentMode";
import DeliverySchedule from "./DeliverySchedule";
import { Context } from "../Context";
import { Link, withRouter } from "react-router-dom";
import CustomLoader from "../CustomLoader";

const Checkout = (props) => {
    const [phone, setPhone] = useState(props.userInfo?.userPhone ?? "");
    const [orderName, setOrderName] = useState(props.userInfo?.userName ?? "");
    const [CP, setCP] = useState(props?.userInfo?.CP ?? "");
    const [neighborhood, setNeighborhood] = useState(
        props?.userInfo?.neighborhood ?? ""
    );
    const [cartTotal, setCartTotal] = useState("");
    const [address, setAddress] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [streetName, setStreetName] = useState("");
    const [paymentMode, setPaymentMode] = useState("transfer"); // while fixing paypal
    const [addressDetails, setAddressDetails] = useState("");
    const [deliveryDay, setDeliveryDay] = useState(
        props?.userInfo?.deliveryDay ?? ""
    ); // testing prop
    const [deliverySchedule, setDeliverySchedule] = useState(
        props?.userInfo?.deliverySchedule ?? ""
    ); // testing prop

    const [buttonIsActive, setButtonIsActive] = useState(false);
    const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
    const [addressAlertMessage, setAddressAlertMessage] = useState(null);
    const [paymentModeReminder, setPaymentModeReminder] = useState("transfer"); // while fixing paypal

    const [totalToPay, setTotalToPay] = useState(false);
    const [upfrontPayPalPayment, setUpfrontPayPalPayment] = useState("");

    // const [csrfToken, setCsrfToken] = useState("");
    // console.log('CP ', CP, 'delivDay ', deliveryDay, 'delivSchedule ', deliverySchedule);
    // console.log('phone length is!!!', phone.length);

    const [show, setShow] = useState(false); // for Overlay Bootstrap element
    const target = useRef(null); // for Overlay Bootstrap element

    const [loader, setLoader] = useState(false);

    const context = useContext(Context);

    // from payment type radio input
    const handlePaymentChange = (e) => {
        console.log(e.target.value);
        setPaymentMode(e.target.value);
        if (e.target.value === "paypal") setTotalToPay(`Total MX$${cartTotal}`);
        else if (e.target.value === "transfer")
            setTotalToPay(`Total MX$${cartTotal}`);
        else setTotalToPay(`Sub-total MX$${upfrontPayPalPayment}`);
    };

    // console.log(
    //     orderName,
    //     paymentMode,
    //     streetName,
    //     addressNumber,
    //     addressDetails,
    //     deliveryDay,
    //     deliverySchedule,
    //     phone,
    //     CP,
    //     neighborhood
    // );

    const handleTransferSubmit = () => {
        context.notifyToaster("info", "Generando orden");
        setLoader(true);

        axios
            .post("/order/rest-api/create", {
                order_name: orderName,
                payment_mode: paymentMode,
                address: `${streetName} #${addressNumber}`,
                address_details: addressDetails,
                delivery_day: deliveryDay,
                delivery_schedule: deliverySchedule,
                phone: phone,
                cp: CP,
                neighborhood: neighborhood,
                balance: 0,
            })
            .then((res) => {
                console.log(res.data);
                const vinoreoOrderID = res.data.orderID;

                axios.post(`/order/success/admin-email`, {
                    orderID: vinoreoOrderID,
                });
                context.notifyToaster("success", "Orden creada exitosamente");
                context.setCartCount(0);

                setTimeout(() => {
                    // setLoader(false);
                    props.history.push(`/checkout/success/${vinoreoOrderID}`);
                }, 4000);
            })
            .catch((err) => {
                console.error(err);
                context.notifyToaster(
                    "warn",
                    "Tuvimos problemas creando tu orden :("
                );
                setLoader(false);
            });
    };

    // validate CP
    const getCpInfo = (cpData) => {
        setCP(cpData.cp);
        setNeighborhood(cpData.name);
    };

    const getDeliveryInfo = (day, schedule) => {
        // console.log(day, schedule);
        setDeliveryDay(day);
        setDeliverySchedule(schedule);
    };

    // get user info and cart total-subtotal
    useEffect(() => {
        let isMounted = true;

        // if phone info available set it
        // props.userInfo?.userPhone &&
        //     setPhone(parseInt(props.userInfo?.userPhone));

        if (isMounted) {
            axios
                .get("/cart/get-total")
                .then((res) => {
                    // console.log('GET TOTAL MADAFAKAAAAAAAAA ', res.data);
                    setCartTotal(
                        // new Intl.NumberFormat("en-US", {
                        //     style: "currency",
                        //     currency: "MXN",
                        // }).format(
                        res.data
                        // )
                    );
                })
                .catch((err) => {
                    console.error(err);
                    context.notifyToaster(
                        "error",
                        "Tenemos problemas con el servidor. Intenta más tarde"
                    );
                });

            axios
                .get("/cart/get-subtotal")
                .then((res) => {
                    // console.log('GET TOAL MAFRENNN ', res.data);
                    setUpfrontPayPalPayment(res.data); // 7% comission
                })
                .catch((err) => {
                    console.error(err);
                    context.notifyToaster(
                        "error",
                        "Tenemos problemas con el servidor. Intenta más tarde"
                    );
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
            // console.log(
            //     "streetname ",
            //     streetName,
            //     'address ',
            //     address,
            //     "address num",
            //     addressNumber,
            //     'CP is ',
            //     CP,
            //     'delivery day is ',
            //     deliveryDay,
            //     'schedule is ',
            //     deliverySchedule
            // );
            if (
                streetName.length > 3 &&
                streetName.length < 6 &&
                !addressNumber
            ) {
                setAddressAlertMessage("Por favor ingresa dirección completa");
            } else if (streetName.length > 5 && !addressNumber) {
                setAddressAlertMessage("Por favor ingresa dirección completa");
            } else {
                setAddressAlertMessage(false);
            }

            // activate proceed button - must check due to async
            // states won't be updated until rerender
            // don't bother trying to await setState

            // console.log(
            //     "active btn? ",
            //     streetName.length,
            //     addressNumber.length,
            //     phonePattern.test(phone) ? true : false,
            //     'phone is', phone,
            //     'phone length', phone.length,
            //     phone.length === 10 ? true : false,
            //     CP ? true : false,
            //     deliveryDay ? true : false,
            //     deliverySchedule ? true : false
            // );
            if (
                streetName.length >= 5 &&
                addressNumber.length > 0 &&
                phonePattern.test(phone) &&
                phone.length === 10 &&
                CP &&
                deliveryDay &&
                deliverySchedule
            ) {
                // console.log("button is active");
                setButtonIsActive(true);
            } else setButtonIsActive(false);
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

    const totalHeader = (
        <h3>
            {/* {paymentMode == "on_delivery"
                ? totalToPay + '<br />' + 'Total MX$' + cartTotal
                : `Total MX$${cartTotal} `} */}
            {`Total MX$${cartTotal}`}
        </h3>
    );

    return (
        <div className="container">
            {!loader ? (
                props.loggedIn && cartTotal > 1500 ? (
                    <div style={{ marginBottom: "6rem" }}>
                        {/* prompt user for payment method */}

                        <div data-testid="top-total-header">
                            {totalHeader && totalHeader}
                        </div>

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
                        <Form
                        // className="mt-3 mb-5"
                        // action="/order/create"
                        // method="post"
                        >
                            {/* place csrf token */}
                            {/* <input type="hidden" value={csrfToken} name="_token" /> */}
                            <input
                                type="hidden"
                                value={paymentMode}
                                name="payment_mode"
                            />
                            <Form.Group>
                                <Form.Label>Tu nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={props.userInfo?.userName}
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
                                    placeholder="Ingresa tu teléfono"
                                    value={phone}
                                    name="phone"
                                    aria-label="phone-input"
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
                                    data-testid="streetName-input"
                                    aria-label="streetName-input"
                                    onChange={(e) => {
                                        setStreetName(e.target.value);
                                    }}
                                />
                                <Form.Label className="mt-2">
                                    Número exterior{" "}
                                    <i>(e interior si tienes)</i>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="El número de la dirección"
                                    value={addressNumber}
                                    aria-label="addressNumber-input"
                                    onChange={(e) => {
                                        setAddressNumber(e.target.value);
                                    }}
                                />
                                {/* <input
                                    type="hidden"
                                    value={`${streetName} - ${addressNumber}`}
                                    name="address"
                                /> */}
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
                                    aria-label="addressDetails-input"
                                    onChange={(e) => {
                                        setAddressDetails(e.target.value);
                                    }}
                                />
                            </Form.Group>

                            {/* let user pay if all information is set */}
                            {/* {console.log(
                                buttonIsActive,
                                addressAlertMessage,
                                phone.length
                            )} */}
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
                            <Button
                                className="mb-5"
                                variant="primary"
                                type="submit"
                                disabled={buttonIsActive ? false : true}
                                onClick={handleTransferSubmit}
                            >
                                Generar orden
                            </Button>
                        </Form>
                        {/* <PaypalPayment /> */}
                    </div>
                ) : (
                    <div>
                        {/* if user is not logged in he can't see the form */}
                        {!props.loggedIn && <LoginOrRegister />}

                        {cartTotal < 1500 && (
                            <Alert variant="warning">
                                No has completado tu compra mínima de MX$1,5000
                            </Alert>
                        )}
                        <Link to="/">
                            <Button variant="primary">Regresar</Button>
                        </Link>
                    </div>
                )
            ) : (
                <CustomLoader />
            )}
        </div>
    );
};

export default withRouter(Checkout);
