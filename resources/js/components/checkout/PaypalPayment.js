import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../Context";

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalPayment = ({ orderInfo }) => {
    const context = useContext(Context);

    /* doesn't include taxes and shipping */
    const value = context.cartContent
        .map((item) => item.quantity * item.price)
        .reduce((a, b) => a + b, 0);

    // const items = (
    //     let data = new Map()
    //     context.cartContent
    // .map((item) => {
    //     {
    //         item: item.name,

    //     }
    // })
    // );

    // const prepareItems = () => {
    //     let data = new Map();

    //     data.set("items", [{
    //         name: context.cartContent[0].name,
    //         sku: context.cartContent[0].id,
    //         unit_amount: {
    //             currency_code: 'MXN',
    //             value: context.cartContent[0].price
    //         },
    //         quantity: context.cartContent[0].quantity,
    //     }]);

    //     return data;
    // }

    const prepareItems = () => {
        return context.cartContent.map((item) => ({
            name: item.name,
            sku: item.id,
            unit_amount: {
                currency_code: "MXN",
                value: item.price,
            },
            quantity: item.quantity,
        }));
    };

    const purchaseUnits = {
        purchase_units: [
            {
                description: "Bebidas Vinoreo",
                amount: {
                    currency_code: "MXN",
                    value: value, // total including taxes, shipping and products
                    breakdown: {
                        item_total: {
                            currency_code: "MXN",
                            value: value,
                        },
                    },
                },
                items: prepareItems(),
            },
        ],
    };

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
                            return res.data.id
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
        console.log("payment approved by user", data, actions.order.get());
        return actions.order.capture().then((res) => {
            console.log(res, 'is array? ', Array.isArray(res));
            res.details ? console.log(res.details) : console.log('no details bru');
        });
    };

    const onCancel = (data, actions) => {
        console.log(data);
        console.log(actions);
        // return actions.redirect("https://vinoreo.mx");
    };

    return (
        <div>
            {orderInfo && console.log(orderInfo)}

            <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
                onCancel={(data, actions) => onCancel(data, actions)}
            />
        </div>
    );
};

export default PaypalPayment;
