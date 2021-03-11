import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Context } from "../Context";

const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PaypalPayment = () => {
    const context = useContext(Context);

    /* doesn't include taxes and shipping */
    const value = (
        context.cartContent
            .map((item) => item.quantity * item.price)
            .reduce((a, b) => a + b, 0)
    );

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
        return (
            context.cartContent.map(item => ({
                name: item.name,
                sku: item.id,
                unit_amount: {
                    currency_code: 'MXN',
                    value: item.price,
                },
                quantity: item.quantity
            }))
        );
    }

    const purchaseUnits = {
        purchase_units: [{
            description: "Bebidas Vinoreo",
            amount: {
                currency_code: 'MXN',
                value: value, // total including taxes, shipping and products
                breakdown: {
                    item_total: {
                        currency_code: 'MXN',
                        value: value
                    },
                },
            },
            items: prepareItems(),
        }],
    };

    const createOrder = (data, actions) => {
        // create order at server side
        // then proceed create
        console.log('starting create order');
        return actions.order.create(
            purchaseUnits
        );
    };

    const onApprove = (data, actions) => {
        console.log('payment approved', data);
        return actions.order.capture().then((res) => {
            console.log(res);
        });
    };

    const onCancel = (data, actions) => {
        console.log(data);
        console.log(actions);
        // return actions.redirect("https://vinoreo.mx");
    };

    return (
        <div>
            {/* {value && console.log(value)}
            {purchaseUnits && console.log('real ', purchaseUnits)}
            {exampleObject && console.log('fake ', exampleObject)} */}
            {/* {prepareItems() && console.log(prepareItems())} */}

            <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
                onCancel={(data, actions) => onCancel(data, actions)}
            />
        </div>
    );
};

export default PaypalPayment;
