import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Alert } from 'react-bootstrap';
library.add(fab);

const PaymentMode = (props) => {

    return (
        <Alert variant={"success"}>
            ¿Cómo deseas pagar?
            <div className="container">
                <ul style={{ listStyle: "none" }}>
                    <li className="mt-2 mb-2">
                        <input
                            type="radio"
                            value={"on_delivery"}
                            name="payment_mode"
                            onClick={props.handlePaymentChange}
                            defaultChecked
                        />
                        Paga un pequeño anticipo de{" "}
                        {Math.ceil(props.upfrontPayPalPayment)}&nbsp;mxn con{" "}
                        <b>PayPal</b> &nbsp;
                        <FontAwesomeIcon icon={faPaypal} /> y liquida la
                        diferencia en efectivo cuando te entreguemos
                    </li>
                    <li className="mt-2 mb-2">
                        <input
                            type="radio"
                            value={"transfer"}
                            name="payment_mode"
                            onClick={props.handlePaymentChange}
                        />
                        El total (100%) con <b>Transferencia o depósito</b>{" "}
                        bancario. Te enviaremos una vez confirmado tu pago.
                    </li>
                    <li className="mt-2 mb-2">
                        <input
                            type="radio"
                            value={"paypal"}
                            name="payment_mode"
                            onClick={props.handlePaymentChange}
                        />
                        El total (100%) con <b>PayPal</b> &nbsp;
                        <FontAwesomeIcon icon={faPaypal} />
                    </li>
                </ul>
            </div>
            <div className="row">
                <div className="col-6"></div>
                <div className="col-6"></div>
            </div>
        </Alert>
    );
}

export default PaymentMode;
