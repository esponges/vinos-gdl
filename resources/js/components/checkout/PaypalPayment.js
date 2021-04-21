import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Context } from "../Context";

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalPayment = ({ orderInfo, ...props }) => {
    const context = useContext(Context);
    const localhost = window.location.protocol + "//" + window.location.host;

    const createOrder = (data, actions) => {
        // create order at server side
        console.log("create order!!!", 'actions ', actions);
        context.notifyToaster(
            "info",
            "Iniciando proceso de pago"
        );
        return axios
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
                if (res.data?.orderID) {
                    return axios
                        .post(
                            "/paypal/rest-api/checkout",
                            {
                                orderID: res.data.orderID,
                            },
                            {
                                headers: {
                                    "content-type": "application/json",
                                },
                            }
                        )
                        .then((res) => {
                            console.log('success', res.data);
                            if (res.data?.error) {
                                context.notifyToaster(
                                    "warn",
                                    "Tuvimos problemas creando la orden. Intenta más tarde."
                                );
                            }
                            return res.data.id;
                        })
                        .catch((err) => {
                            console.error("error getting ID from api", err);
                            context.notifyToaster(
                                "warn",
                                "Paypal está fallando. Intenta más tarde o con otro método."
                            );
                            props.setLoader(false);
                        });
                } else {
                    context.notifyToaster(
                        "warn",
                        "Tuvimos problemas creando la orden. Intenta más tarde."
                    );
                    props.setLoader(false);
                }
            })
            .catch((err) => {
                console.error(err);
                context.notifyToaster(
                    "warn",
                    "Tuvimos problemas creando la orden. Intenta más tarde."
                );
                props.setLoader(false);
            });
    };

    const onApprove = (data, actions) => {
        console.log("payment approved by user", data, actions);

        context.notifyToaster("success", 'Procesando aprobación');
        props.setShowPayPalBtn(true);
        props.setButtonIsActive(false);
        props.setLoader(true);

        const orderID = data.orderID;
        return axios
            .post("/paypal/rest-api/capture-order", {
                orderID: orderID,
            })
            .then((res) => {
                const vinoreoOrderID = res.data.vinoreo_orderID;
                //send admin email async
                axios.get(`/order/success/admin-email/${vinoreoOrderID}`);

                console.log("success capturing order", res.data);
                context.notifyToaster(
                    'success',
                    'Pago y orden procesados correctamente'
                )
                props.setLoader(false);
                // take user to success view
                props.history.push(`/checkout/success/${vinoreoOrderID}`);
            })
            .catch((err) => {
                if (
                    err?.response?.data?.error?.details?.[0]?.issue ===
                    "INSTRUMENT_DECLINED"
                ) {
                    console.error("gotcha!!! INSTRUMENT");

                    context.notifyToaster(
                        "warn",
                        "Tu método de pago fue rechazado. Prueba con otro."
                    );
                    // propmt the user to use a different payment method
                    const restartPayment = () => {
                        console.log('restart timeouttt');
                        props.setLoader(false);
                        actions.restart();
                    }
                    return setTimeout(() => restartPayment(), 3000);
                }
                // tell user about the error
                console.log("oh nooooo, a differente error: ", err);
                props.setLoader(false);
                context.notifyToaster(
                    "error",
                    "Problemas con el servidor de Paypal. Intenta más tarde."
                );
                // redirect user to unsuccessful view
                props.history.push(`/checkout/fail`);
            });
    };

    const onCancel = (data, actions) => {
        props.setLoader(false);

        context.notifyToaster("warn", "Proceso de pago interrumpido");
    };

    return (
        <div>
            <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
                onCancel={(data, actions) => onCancel(data, actions)}
            />
        </div>
    );
};

export default withRouter(PaypalPayment);
