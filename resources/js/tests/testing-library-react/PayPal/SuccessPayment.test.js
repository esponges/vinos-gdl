import React from "react";
import "@testing-library/jest-dom";
import { screen, render, cleanup, act, waitFor } from "@testing-library/react";
import { HashRouter } from "react-router-dom";

import axiosMock from "axios";

import SuccessfulPayment from "../../../components/checkout/PayPal/SuccessfulPayment";

jest.mock("axios");

let fakeOrderResponse = {
    order: {
        id: 2139,
        total: 1530,
        total_items: 3,
        payment_mode: "on_delivery",
        is_paid: 1,
        address: "sdsdsd #11",
        address_details: null,
        phone: "4567892345",
        cp: 25688,
        user_id: 1,
        created_at: "2021-03-19T19:16:15.000000Z",
        updated_at: "2021-03-19T19:16:41.000000Z",
        order_name: "Sarah Haag",
        delivery_day: "Próximo Martes",
        delivery_schedule: "10am a 12pm",
        neighborhood: "asdNorth Jaimechester",
        balance: 102,
        paypal_id: null,
    },
    cartItems: [
        {
            name: "Don Julio Reposado 700ml",
            price: 510,
            quantity: 3,
        },
    ],
};

const setUp = async () => {
    const mock = axiosMock.post.mockResolvedValueOnce({
        data: fakeOrderResponse,
    });

    const utils = await act(async () =>
        render(
            <HashRouter>
                <SuccessfulPayment />
            </HashRouter>
        )
    );

    return { mock, utils };
};

// beforeAll(() => setUp())
afterEach(cleanup);

describe("SuccessfulPayment", () => {
    test("it renders", async () => {
        await setUp();
        const conf = screen.getByText(/confirmación de la orden/i);

        expect(conf).toBeInTheDocument();
    });

    test("shows total heading correctly", async () => {
        await setUp();
        // const cartItems = screen.getByRole('paragraph', { name: /total de tu orden MX\$1530/i});
        const total = screen.getByTestId("order-total");
        const orderTotal = fakeOrderResponse.order.total;

        expect(total).toHaveTextContent(`Total de tu orden MX$ ${orderTotal}`);
    });

    it("shows what was paid with paypal correctly", async () => {
        await setUp();

        const paidWithPaypal = screen.getByTestId("paid-with-paypal");
        const paid = fakeOrderResponse.order.balance;

        expect(paidWithPaypal).toHaveTextContent(
            `Anticipo pagado con PayPal MX$${paid}`
        );
    });

    it("shows user what's left to pay on delivery", async () => {
        await setUp();

        const payOnDelivery = screen.getByRole("heading", {
            name: /saldo a pagar contra entrega/i,
        });
        const { total, balance } = fakeOrderResponse.order;
        const toPay = total - balance;
        expect(payOnDelivery).toHaveTextContent(
            `Saldo a pagar contra entrega MX$${toPay}`
        );
    });
});

describe("transfer order", () => {
    it("it shows the correct total if it's transfer", async () => {
        fakeOrderResponse.order.payment_mode = "transfer";
        await setUp();

        const transferQty = screen.getByTestId("relevant-payment-info");
        const total = fakeOrderResponse.order.total;

        expect(transferQty).toHaveTextContent(`Por transferir MX$${total}`);
    });

    it("displays bank information on transfer", async () => {
        await setUp();

        const bankJumbotron = screen.getByRole("heading", {
            name: /información de depósito\/transferencia/i,
        });
        expect(bankJumbotron).toBeInTheDocument();
    });

    it('doesn\'t say that your order was paid', async() => {
        await setUp();

        const orderPaidMsg = screen.queryByTestId('order-paid'); // use query instead get
        expect(orderPaidMsg).not.toBeInTheDocument();
    });
});

// const server = setupServer(
//     rest.post("/order/info", (req, res, ctx) => {
//         return res(ctx.json(fakeOrderResponse));
//     })
// );

// beforeAll(() => {
//     server.listen();
// });
// afterEach(() => {
//     server.resetHandlers();
//     window.localStorage.removeItem("order");
//     window.localStorage.removeItem("cartItems");
// });
// afterAll(() => server.close());

// describe("SuccessfulPayment", () => {
//     it("renders", async () => {
//         await act(async () => render(
//             <HashRouter>
//                 <SuccessfulPayment />
//             </HashRouter>
//         ));
//         const view = await screen;
//         view.debug();
//         expect(view).toBeTruthy();
//     });

//     it("renders after api calls", () => {
//         render(
//             <HashRouter>
//                 <SuccessfulPayment vinoreoOrderID={2} />
//             </HashRouter>
//         );
//         const emailMsgElement = screen.getByText(/Tienes un correo/i);
//         expect(emailMsgElement).toBeInTheDocument();
//         // expect(screen.getByText(/Tienes un correo/i)).toBeInTheDocument();
//     });

// it('renders back btn', () => {
//     screen.getByRole('link', { hidden: true });
// });
// });
