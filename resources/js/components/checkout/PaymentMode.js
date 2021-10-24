import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Alert } from "react-bootstrap";
library.add(fab);

const PaymentMode = (props) => {
    return (
        <div>
            <Alert variant={"success"}>
                ¿Cómo deseas pagar?
                <div className="container">
                    <ul style={{ listStyle: "none" }}>
                        <li className="mt-2 mb-2">
                            <input
                                type="radio"
                                value={"transfer"}
                                name="payment_mode"
                                onClick={props.handlePaymentChange}
                                defaultChecked
                            />
                            El total (100%) con <b>Transferencia o depósito</b>{" "}
                            bancario. Te enviaremos una vez confirmado tu pago.
                        </li>
                        <li className="mt-2 mb-2">
                            <input
                                type="radio"
                                value={"full_MP"}
                                name="payment_mode"
                                onClick={props.handlePaymentChange}
                            />
                            El total (100%) con <b>MercadoPago.</b> &nbsp;
                        </li>
                    </ul>
                </div>
                <div className="row">
                    <div className="col-6"></div>
                    <div className="col-6"></div>
                </div>
            </Alert>
        </div>
    );
};

export default PaymentMode;
