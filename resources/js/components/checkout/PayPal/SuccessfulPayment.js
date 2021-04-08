import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import CustomLoader from "../../CustomLoader";

const SuccessfulPayment = (props) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const [cartItems, setCartItems] = useState(null);
    const vinoreoOrderID = props.match.params.id;

    useEffect(() => {
        let isMounted = true;

        axios
            .post("/order/info", {
                vinoreoOrderID: vinoreoOrderID,
            })
            .then((res) => {
                setOrderInfo(res.data.order);
                setCartItems(res.data.cartItems);
            })
            .catch(() => {
                setOrderInfo(null);
                setCartItems(null);
            });

        return () => (isMounted = false);
    }, []);

    return (
        <Card>
            {console.log(vinoreoOrderID)}
            {orderInfo && cartItems ? (
                <div>
                    <div className="container mt-2">
                        <p>
                            Confirmación de la orden <b>#{orderInfo.id}</b>
                        </p>
                        <p className="mt-4">
                            <b>Resumen de compra</b>
                        </p>
                        <table className="table mt-2 mb-2">
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
                            <p className="mt-4">
                                Orden N° <b>{orderInfo.id}</b>{" "}
                            </p>
                            <p>
                                <b>Total de tu orden MX$ {orderInfo.total}</b>
                            </p>
                            <p>
                                {orderInfo.payment_mode === "transfer" && (
                                    <b>
                                        Anticipo Pagado MX$
                                        {orderInfo?.balance ?? 0}
                                    </b>
                                )}
                            </p>
                            <h3 className="mt-3">
                                Total{" "}
                                {orderInfo.payment_mode !== "transfer"
                                    ? "pagado con PayPal"
                                    : "a transferir"}
                                &nbsp;
                                <u>MX$</u>
                                &nbsp;
                                <u>
                                    {orderInfo.payment_mode === 'transfer' && orderInfo.total}
                                    {orderInfo.payment_mode === 'on_delivery' && orderInfo.total - orderInfo.balance}
                                    {orderInfo.payment_mode === 'paypal' && orderInfo.total}
                                </u>
                            </h3>
                            {orderInfo.payment_mode === "on_delivery" ? (
                                <div>
                                    <h3>
                                        <b>Saldo a pagar contra entrega MX${orderInfo.total - orderInfo.balance}</b>
                                    </h3>
                                    <u>
                                        Recuerda que el repartidor sólo recibe
                                        efectivo
                                    </u>
                                </div>
                            ) : (
                                orderInfo.payment_mode === 'paypal' && <u>Tu orden está pagada</u>
                            )}
                            <br />
                        </Card>

                        {orderInfo.payment_mode === "transfer" && (
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
                                                Banco <br/><b>Banorte</b>
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
                            Nombre <b>{orderInfo.order_name}</b>{" "}
                        </p>
                        <p>
                            Teléfono de contacto: <b>{orderInfo.phone}</b>
                        </p>
                        <p>
                            Dirección de envio<b> {orderInfo.address}</b>{" "}
                        </p>
                        <p>
                            Detalles de la dirección
                            <b> {orderInfo.addressDetails ?? "n/d"} </b>
                        </p>
                        <p>
                            Colonia
                            <b>
                                &nbsp;
                                {orderInfo.neighborhood + " " + orderInfo.cp}
                            </b>
                        </p>
                        <br />
                        <p>
                            Día de entrega<b>&nbsp;{orderInfo.delivery_day}</b>
                        </p>
                        <p className="card-text mb-4">
                            Horario aproximado de entrega
                            <b>&nbsp;{orderInfo.delivery_schedule}</b>
                        </p>
                    </div>
                </div>
            ) : (
                <CustomLoader />
            )}
            <Card.Body>Tienes un correo de confirmación de compra</Card.Body>
            <Link to="/">
                <Button variant="primary" style={{ margin: "0 3% 3%" }}>
                    Regresar
                </Button>
            </Link>
        </Card>
    );
};
export default withRouter(SuccessfulPayment);
