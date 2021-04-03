import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Context } from "../Context";

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalPayment = ({ orderInfo, ...props }) => {
    const context = useContext(Context);

    const createOrder = (data, actions) => {
        // create order at server side
        {
            console.log("create order!!!");
        }
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
                if (res.data.orderID) {
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
                            console.log(res.data);
                            return res.data.id;
                        })
                        .catch((err) => {
                            console.error("error getting ID from api", err);
                        });
                } else console.log("error creating order");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const onApprove = (data, actions) => {
        console.log("payment approved by user", data);
        const orderID = data.orderID;

        /* SUCCESS */

        const accessToken = document.head
            .querySelector('meta[name="paypaltoken"]')
            .getAttribute("content");

        // return axios
        //     .post(
        //         `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        //         {},
        //         {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 Authorization: "Bearer " + accessToken,
        //                 "PayPal-Mock-Response":
        //                     '{"mock_application_codes":"INSTRUMENT_DECLINED"}',
        //             },
        //         }
        //     )
        //     .then((res) => {
        //         console.log('response from caputre ', res);
        //     })
        //     .catch((err) => {
        //         console.log(err.response);
        //         if (err?.response?.data?.details?.[0]?.issue) { // it works!!!
        //             console.log('catched the issue!!');
        //             return actions.restart();
        //         }
        //     });

        return axios
            .post("/paypal/rest-api/capture-order", {
                orderID: orderID,
            })
            .then((res) => {
                console.log("success capturing order", res.data);
                // take user to success view
            })
            .catch((err) => {
                if (err?.response?.data?.error?.details?.[0]?.issue === 'INSTRUMENT_DECLINED') {
                    console.error('gotcha!!! INSTRUMENT')
                    // propmt the user to use a different payment method
                    return actions.restart();
                }
                // tell user about the error
                console.log('oh nooooo, a differente error');
            });
    };

    const onCancel = (data, actions) => {
        console.log(data);
        console.log(actions);
        // return actions.redirect("https://vinoreo.mx");
    };

    return (
        <div>
            {orderInfo && console.log(orderInfo, props)}

            <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
                onCancel={(data, actions) => onCancel(data, actions)}
            />
        </div>
    );
};

export default withRouter(PaypalPayment);
