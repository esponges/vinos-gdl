import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import React from "react";
import { HashRouter } from "react-router-dom";
import IndexNavbar from "../../components/index/IndexNavbar";

describe('IndexNavbar', () => {
    const props = {
        cartCount: 0,
    }

    beforeAll(() => {
        render(
            <HashRouter>
                <IndexNavbar />
            </HashRouter>
        );
    });

    console.log(props.cartCount);

    it('renders', () => {
        expect(screen).toBeTruthy();
    });

    it('shows cart badge qty', () => {
        expect(screen.queryByTestId('card-count-badge')).toBeInTheDocument();
        screen.getByRole('', {hidden: true});
        // expect(screen.queryByTestId('card-count-badge')).toBeInTheDocument();
    });
});
