import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import CustomLoader from "../../CustomLoader";

const SuccessfulPayment = (props) => {
    const [cartItems, setCartItems] = useState(null);
    const [cartTotal, setCartTotal] = useState(null);
    const [paidWithPayPal, setPaidWithPayPal] = useState(null);
    const [payWithMercadoPago, setPayWithMercadoPago] = useState(null);
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
                const { data: { order, cartItems, order: { total, payment_mode } } } = res;

                setOrderInfo(order);
                setCartItems(cartItems);
                setCartTotal(total);
                setPayWithMercadoPago(payment_mode === 'full_MP');

            })
            .catch(() => {
                setOrderInfo(null);
                setCartItems(null);
            });
    }, []);

    return (
        <Card>
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
                            <div className="container">
                                <p className="mt-2">
                                    Orden N° <b>{id}</b>{" "}
                                </p>
                                <p data-testid="order-total">
                                    <b>Total de tu orden MX$ {cartTotal}</b>
                                </p>
                                <h3 className="mt-1">
                                    <u>
                                        <div data-testid="relevant-payment-info">
                                            {payment_mode === "transfer" && (
                                                <div>
                                                    <p>
                                                        Total a transferir MX${cartTotal}
                                                    </p>
                                                </div>
                                            )}
                                            {payment_mode === "on_delivery" && (
                                                <div data-testid="paid-with-paypal">
                                                    Anticipo pagado con PayPal MX$
                                                    {paidWithPayPal}
                                                </div>
                                            )}
                                            {payment_mode === "full_MP" && (
                                                <div>
                                                    Total a pagar con MercadoPago MX$&nbsp;
                                                    {cartTotal}
                                                </div>
                                            )}
                                        </div>
                                    </u>
                                </h3>
                                {payment_mode === "full_MP" && (
                                    <p>
                                        Te contactaremos para enviarte tu link de pago con MercadoPago
                                    </p>
                                )}
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

                            </div>
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
                                                <b>0123 2001 5371 445882</b>
                                                <br />
                                            </li>
                                            <li>
                                                Nombre <br />
                                                <b>Tomas Sanchez Garcia</b>
                                            </li>
                                            <li>
                                                N° de cuenta <br />
                                                <b>153 714 4588</b>
                                                <br />
                                            </li>
                                            <li>
                                                Banco <br />
                                                <b>BBVA BANCOMER</b>
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
