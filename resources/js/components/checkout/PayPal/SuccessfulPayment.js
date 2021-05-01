import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import CustomLoader from "../../CustomLoader";

const SuccessfulPayment = (props) => {
    const [cartItems, setCartItems] = useState(null);
    const [cartTotal, setCartTotal] = useState(null);
    const [paidWithPayPal, setPaidWithPayPal] = useState(null);
    const [toPayOnDelivery, setToPayOnDelivery] = useState(null);
    const [orderInfo, setOrderInfo] = useState({
        id: "",
        payment_mode: "",
        order_name: "",
        phone: "",
        address: "",
        address_details: "",
        neighborhood: "",
        cp: "",
        delivery_day: "",
        delivery_schedule: "",
    });

    const {
        id,
        payment_mode,
        order_name,
        phone,
        address,
        address_details,
        neighborhood,
        cp,
        delivery_day,
        delivery_schedule,
    } = orderInfo;

    const vinoreoOrderID = props.match.params.id;

    useEffect(() => {
        axios
            .post("/order/info", {
                vinoreoOrderID: vinoreoOrderID,
            })
            .then((res) => {
                setOrderInfo(res.data.order);
                setCartItems(res.data.cartItems);
                setCartTotal(res.data.order.total);

                res.data.order.payment_mode !== "transfer"
                    ? setPaidWithPayPal(
                        res.data.order.payment_mode === "on_delivery"
                            ? res.data.order.balance
                            : res.data.order.total
                    )
                    : setPaidWithPayPal(0);

                res.data.order.payment_mode !== "transfer"
                    ? setToPayOnDelivery(
                        res.data.order.payment_mode === "on_delivery"
                            ? res.data.order.total - res.data.order.balance
                            : 0
                    )
                    : setToPayOnDelivery(0);
            })
            .catch(() => {
                setOrderInfo(null);
                setCartItems(null);
                console.log("we are null!!!");
            });
    }, []);

    return (
        <Card>
            {/* {console.log(vinoreoOrderID)} */}
            {orderInfo && cartItems ? (
                <div>
                    <div className="container mt-2">
                        <p>
                            Confirmación de la orden <b>#{id}</b>
                        </p>
                        <p className="mt-4">
                            <b>Resumen de compra</b>
                        </p>
                        <table className="table mt-2 mb-4">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td scope="row">{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {item.quantity * item.price}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Card style={{ marginLeft: "3%" }}>
                            <p className="mt-2">
                                Orden N° <b>{id}</b>{" "}
                            </p>
                            <p data-testid="order-total">
                                <b>Total de tu orden MX$ {cartTotal}</b>
                            </p>
                            <p>
                                {payment_mode === "transfer" && (
                                    <b>Anticipo Pagado MX$0</b>
                                )}
                            </p>
                            <h3 className="mt-1">
                                {
                                    payment_mode !== "transfer" &&
                                        "Pagado con PayPal "
                                    // payment_mode === "paypal"
                                    //     ? "Total"
                                    //     : "Anticipo"}
                                    // {payment_mode !== "transfer"
                                    //     ? " pagado con PayPal"
                                    //     : "Total a transferir"
                                }
                                {/* &nbsp;
                                <u>MX$</u>
                                &nbsp; */}
                                <u>
                                    <div data-testid="relevant-payment-info">
                                        {payment_mode === "transfer" && (
                                            <div>
                                                Por transferir MX${cartTotal}
                                                <p>
                                                    Puedes transferir MX$
                                                    {paidWithPayPal} y el resto
                                                    pagar en efectivo al
                                                    recibir.
                                                </p>
                                            </div>
                                        )}
                                        {payment_mode === "on_delivery" && (
                                            <div data-testid="paid-with-paypal">
                                                Anticipo pagado con PayPal MX$
                                                {paidWithPayPal}
                                            </div>
                                        )}
                                        {payment_mode === "paypal" && (
                                            <div>
                                                Total pagado con PayPal MX$
                                                {cartTotal}
                                            </div>
                                        )}
                                    </div>
                                </u>
                            </h3>
                            {payment_mode === "on_delivery" ? (
                                <div className="mt-4">
                                    <h3>
                                        <b>
                                            Saldo a pagar contra entrega MX$
                                            {toPayOnDelivery}
                                        </b>
                                    </h3>
                                    <u>
                                        Recuerda que el repartidor sólo recibe
                                        efectivo
                                    </u>
                                </div>
                            ) : (
                                payment_mode === "paypal" && (
                                    <u data-testid="order-paid">
                                        Tu orden ya está pagada. Te llegará en
                                        el día y horario que elegiste.
                                    </u>
                                )
                            )}
                            <br />
                        </Card>

                        {payment_mode === "transfer" && (
                            <div>
                                <div
                                    className="jumbotron jumbotron-fluid mt-2"
                                    id="transfer-success-blade-jumbo"
                                >
                                    <div className="container">
                                        <h3>
                                            Información de
                                            depósito/transferencia
                                        </h3>
                                        <ul style={{ listStyle: "none" }}>
                                            <li>
                                                CLABE interbancaria <br />
                                                <b>0723 2000 3244 528134</b>
                                                <br />
                                            </li>
                                            <li>
                                                Nombre <br />
                                                <b>
                                                    Licoret Occidental SA de CV
                                                </b>
                                            </li>
                                            <li>
                                                N° de cuenta <br />
                                                <b>032 445 2813</b>
                                                <br />
                                            </li>
                                            <li>
                                                Banco <br />
                                                <b>Banorte</b>
                                                <br />
                                                <br />
                                            </li>
                                        </ul>
                                        <p>
                                            Por favor envía tu comprobante de
                                            pago junto a tu número de orden al
                                            Whatsapp&nbsp;
                                            <b>33 20 19 24 20</b> o al correo
                                            electrónico&nbsp;
                                            <b>hola@vinoreo.mx</b>
                                            &nbsp;para procesar tu envío
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-2 mb-5">
                                    <em>
                                        Si no se confirma tu pago para tu fecha
                                        de entrega deseada, ésta será
                                        reprogramada. <br />
                                        <br />
                                    </em>{" "}
                                    No te preocupes, nos pondremos en contacto
                                    contigo.
                                </p>
                            </div>
                        )}

                        <p className="card-text mt-4">
                            Nombre <b>{order_name}</b>{" "}
                        </p>
                        <p>
                            Teléfono de contacto: <b>{phone}</b>
                        </p>
                        <p>
                            Dirección de envio<b> {address}</b>{" "}
                        </p>
                        <p>
                            Detalles de la dirección
                            <b> {address_details ?? "n/d"} </b>
                        </p>
                        <p>
                            Colonia
                            <b>
                                &nbsp;
                                {neighborhood + " " + cp}
                            </b>
                        </p>
                        <br />
                        <p>
                            Día de entrega<b>&nbsp;{delivery_day}</b>
                        </p>
                        <p className="card-text mb-4">
                            Horario aproximado de entrega
                            <b>&nbsp;{delivery_schedule}</b>
                        </p>
                    </div>
                </div>
            ) : (
                <CustomLoader />
            )}
            <Card.Body>Tienes un correo de confirmación de compra</Card.Body>
            <Link to="/" data-testid="back-btn">
                <Button variant="primary" style={{ margin: "0 3% 3%" }}>
                    Regresar
                </Button>
            </Link>
        </Card>
    );
};
export default withRouter(SuccessfulPayment);
