import React from "react";
import "@testing-library/jest-dom";
import { screen, render, cleanup, act } from "@testing-library/react";
import { HashRouter } from "react-router-dom";

import { rest } from "msw";
import { setupServer } from "msw/node";
import axiosMock from 'axios';

import SuccessfulPayment from "../../../components/checkout/PayPal/SuccessfulPayment";

jest.mock('axios');

const fakeOrderResponse = {
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

test('mock axios', async () => {
    const url = "/order/info";
    await act(async () => {
        render(
            <HashRouter>
                <SuccessfulPayment url={url} />
            </HashRouter>
        );

        axiosMock.post.mockResolvedValueOnce({
            data: fakeOrderResponse
        });
    });
});

const server = setupServer(
    rest.post("/order/info", (req, res, ctx) => {
        return res(ctx.json(fakeOrderResponse));
    })
);

beforeAll(() => {
    server.listen();
});
afterEach(() => {
    server.resetHandlers();
    window.localStorage.removeItem("order");
    window.localStorage.removeItem("cartItems");
});
afterAll(() => server.close());

describe("SuccessfulPayment", () => {
    it("renders", async () => {
        await act(async () => render(
            <HashRouter>
                <SuccessfulPayment />
            </HashRouter>
        ));
        const view = await screen;
        view.debug();
        expect(view).toBeTruthy();
    });

    it("renders after api calls", () => {
        render(
            <HashRouter>
                <SuccessfulPayment vinoreoOrderID={2} />
            </HashRouter>
        );
        const emailMsgElement = screen.getByText(/Tienes un correo/i);
        expect(emailMsgElement).toBeInTheDocument();
        // expect(screen.getByText(/Tienes un correo/i)).toBeInTheDocument();
    });

    // it('renders back btn', () => {
    //     screen.getByRole('link', { hidden: true });
    // });
});
