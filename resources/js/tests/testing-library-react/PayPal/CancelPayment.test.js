import "@testing-library/jest-dom";
import { screen, render, getByTestId } from "@testing-library/react";

import React from "react";
import { HashRouter, MemoryRouter } from "react-router-dom";
import CancelPayment from "../../../components/checkout/PayPal/CancelPayment";

describe("CancelPayment", () => {
    beforeAll(() => {
        render(
            <MemoryRouter>
                <CancelPayment />
            </MemoryRouter>
        );
    });

    it("renders", () => {
        expect(screen).toBeTruthy();
    });

    it('contains a card', () => {
        const { getByText } = render(
            <MemoryRouter>
                <CancelPayment />
            </MemoryRouter>
        );
        getByText('Cancelaste el pago');
    });
});
