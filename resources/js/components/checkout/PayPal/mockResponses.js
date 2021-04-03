const internalServerError = {
    name: "INTERNAL_SERVER_ERROR",
    message: "An internal server error occurred.",
};

const InstrumentDeclined = {
    name: "UNPROCESSABLE_ENTITY",
    details: [
        {
            issue: "INSTRUMENT_DECLINED",
            description:
                "The instrument presented  was either declined by the processor or bank, or it can't be used for this payment.",
        },
    ],
    message:
        "The requested action could not be completed, was semantically incorrect, or failed business validation.",
    debug_id: "70c28ae654da",
    links: [
        {
            href:
                "https://developer.paypal.com/docs/api/orders/v2/#error-INSTRUMENT_DECLINED",
            rel: "information_link",
            method: "GET",
        },
    ],
};

if (InstrumentDeclined?.details?.[0]?.issue) {
    console.log("catched the issue!!");
}
if (InstrumentDeclined.details[0].issue) {
    console.log("catched the issue!!");
}
if (InstrumentDeclined?.nigga) console.log("wtf mannn!!!");
console.log("your chaining operator doesnt work bro");

const stringInstrumentDeclined = 'INSTRUMENT_DEXCLINED';

if (stringInstrumentDeclined.search('INSTRUMENT_DECLINED') != -1) console.log('found etttt');
else console.log('didnt find it');

const captureCompleted = {
    id: "3S360348517983036",
    status: "COMPLETED",
    purchase_units: [
        {
            reference_id: "2527",
            shipping: {
                name: {
                    full_name: "Sarah Haag",
                },
                address: {
                    address_line_1: "monza #1152",
                    admin_area_2: "asdNorth Jaimechester",
                    admin_area_1: "JAL",
                    postal_code: "25688",
                    country_code: "MX",
                },
            },
            payments: {
                captures: [
                    {
                        id: "8P12117811011912B",
                        status: "COMPLETED",
                        amount: {
                            currency_code: "MXN",
                            value: "1970.00",
                        },
                        final_capture: true,
                        seller_protection: {
                            status: "ELIGIBLE",
                            dispute_categories: [
                                "ITEM_NOT_RECEIVED",
                                "UNAUTHORIZED_TRANSACTION",
                            ],
                        },
                        seller_receivable_breakdown: {
                            gross_amount: {
                                currency_code: "MXN",
                                value: "1970.00",
                            },
                            paypal_fee: {
                                currency_code: "MXN",
                                value: "106.29",
                            },
                            net_amount: {
                                currency_code: "MXN",
                                value: "1863.71",
                            },
                        },
                        custom_id: "Vinoreomx",
                        links: [
                            {
                                href:
                                    "https://api.sandbox.paypal.com/v2/payments/captures/8P12117811011912B",
                                rel: "self",
                                method: "GET",
                            },
                            {
                                href:
                                    "https://api.sandbox.paypal.com/v2/payments/captures/8P12117811011912B/refund",
                                rel: "refund",
                                method: "POST",
                            },
                            {
                                href:
                                    "https://api.sandbox.paypal.com/v2/checkout/orders/3S360348517983036",
                                rel: "up",
                                method: "GET",
                            },
                        ],
                        create_time: "2021-04-03T03:07:18Z",
                        update_time: "2021-04-03T03:07:18Z",
                    },
                ],
            },
        },
    ],
    payer: {
        name: {
            given_name: "John",
            surname: "Doe",
        },
        email_address: "sb-yvyh05770976@personal.example.com",
        payer_id: "Y2QWA52N3WQHS",
        address: {
            country_code: "US",
        },
    },
    links: [
        {
            href:
                "https://api.sandbox.paypal.com/v2/checkout/orders/3S360348517983036",
            rel: "self",
            method: "GET",
        },
    ],
};
