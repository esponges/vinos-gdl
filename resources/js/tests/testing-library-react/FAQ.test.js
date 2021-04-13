import "@testing-library/jest-dom";
import { screen, render, cleanup } from "@testing-library/react";

import React from "react";
import { HashRouter } from "react-router-dom";
import FAQ from "../../components/elements/FAQ";

describe('FAQ', () => {
    it('get roles', () => {
        render(<HashRouter>
            <FAQ />
        </HashRouter>)
        // const container = document.querySelector('#back-btn');
        // expect(container.getByRole('buton')).toBeInTheDocument();
        // expect(screen.queryByTestId('#back-btn')).toBeTruthy();
        // screen.debug();
        const pagos = screen.getByText(/Pagos/i);
        expect(pagos).toBeInTheDocument();
        const header = screen.getByText(/¿El producto es confiable?/i);
        expect(header).toBeInTheDocument();
        const link = screen.getByText(/Regresar/i);
        expect(link).toBeInTheDocument();
    });
});
