import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Context } from "../Context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalPayment = ({ orderInfo, ...props }) => {
    const context = useContext(Context);

    const localhost = window.location.protocol + "//" + window.location.host;

    const notifyToaster = (variant, msg) => {
        if (variant === 'warn') {
            return toast.warn(msg);
        } else if (variant === 'success') {
            return toast.success(msg);
        } else if (variant === 'error') {
            return toast.error(msg);
        } else {
            return toast.info(msg);
        }
    }


    const createOrder = (data, actions) => {
        // create order at server side
        console.log("create order!!!", 'actions ', actions);
        notifyToaster(
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
                                notifyToaster(
                                    "warn",
                                    "Tuvimos problemas creando la orden. Intenta más tarde."
                                );
                            }
                            return res.data.id;
                        })
                        .catch((err) => {
                            console.error("error getting ID from api", err);
                            notifyToaster(
                                "warn",
                                "Paypal está fallando. Intenta más tarde o con otro método."
                            );
                            props.setLoader(false);
                        });
                } else {
                    notifyToaster(
                        "warn",
                        "Tuvimos problemas creando la orden. Intenta más tarde."
                    );
                    props.setLoader(false);
                }
            })
            .catch((err) => {
                console.error(err);
                notifyToaster(
                    "warn",
                    "Tuvimos problemas creando la orden. Intenta más tarde."
                );
                props.setLoader(false);
            });
    };

    const onApprove = (data, actions) => {
        console.log("payment approved by user", data, actions);
        const orderID = data.orderID;

        notifyToaster("success", 'Procesando aprobación');
        props.setShowPayPalBtn(false);
        props.setLoader(true);

        return axios
            .post("/paypal/rest-api/capture-order", {
                orderID: orderID,
            })
            .then((res) => {
                console.log("success capturing order", res.data);
                notifyToaster(
                    'success',
                    'Pago y orden procesados correctamente'
                )
                const vinoreoOrderID = res.data.vinoreo_orderID;
                // take user to success view
                return actions.redirect(`${localhost}/#/checkout/success/${vinoreoOrderID}`);
            })
            .catch((err) => {
                if (
                    err?.response?.data?.error?.details?.[0]?.issue ===
                    "INSTRUMENT_DECLINED"
                ) {
                    console.error("gotcha!!! INSTRUMENT");
                    notifyToaster(
                        "warn",
                        "Tu método de pago fue rechazado. Prueba con otro."
                    );
                    // propmt the user to use a different payment method
                    const restartPayment = () => {
                        console.log('restart timeouttt');
                        props.setLoader(false);
                        actions.restart();
                    }
                    return setTimeout(() => restartPayment(), 3500);
                }
                // tell user about the error
                console.log("oh nooooo, a differente error: ", err);
                props.setLoader(false);
                return notifyToaster(
                    "error",
                    "Problemas con el servidor de Paypal. Intenta más tarde."
                );
                // redirect user to unsuccessful view
            });
    };

    const onCancel = (data, actions) => {
        // console.log(data);
        // console.log(actions);
        props.setLoader(false);

        notifyToaster("warn", "Proceso de pago interrumpido");
        // return actions.redirect(`${localhost}/#/checkout/cancel`);
        // return actions.redirect("https://vinoreo.mx");
    };

    return (
        <div>
            {orderInfo && console.log(orderInfo, props)}
            <ToastContainer position="top-center"/>

            <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
                onCancel={(data, actions) => onCancel(data, actions)}
            />
        </div>
    );
};

export default withRouter(PaypalPayment);
