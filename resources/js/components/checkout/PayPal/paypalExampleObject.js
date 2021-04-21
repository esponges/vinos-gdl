    const exampleObject = {
        purchase_units: [
            {
                description: "Bebidas Vinoreo",
                amount: {
                    currency_code: "MXN",
                    value: `2000`, // total including taxes, shipping and products
                    breakdown: {
                        item_total: {
                            currency_code: "MXN",
                            value: "2000"
                        },
                    },
                },
                items: [
                    {
                        name: "maestro dobel 750ml",
                        sku: "4",
                        unit_amount: {
                            currency_code: "MXN",
                            value: "530",
                        },
                        quantity: "3",
                    },
                    {
                        name: "don julio 70 700ml",
                        sku: "4",
                        unit_amount: {
                            currency_code: "MXN",
                            value: "410",
                        },
                        quantity: "1",
                    },
                ],
                shipping: {
                    name: {
                        full_name: "paquito perez",
                    },
                    address: {
                        address_line_1: "casi chiquita",
                        admin_area_2: "zapopan",
                        admin_area_1: "jalisco",
                        postal_code: "25267",
                        country_code: "MX",
                    },
                },
            },
        ],
    };


    /* Build the object for the create order request */

        /* doesn't include taxes and shipping */
    const value = context.cartContent
        .map((item) => item.quantity * item.price)
        .reduce((a, b) => a + b, 0);

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
