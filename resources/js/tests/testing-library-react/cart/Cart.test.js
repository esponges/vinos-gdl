import React from "react";
import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import Cart from "../../../components/elements/Cart";

// jest.unmock("axios");
import axiosMock from "axios";
jest.mock('axios');

let data = [
    {
        id: 3,
        name: "Don Julio Reposado 700ml",
        price: 510,
        quantity: "4",
        attributes: [],
        conditions: [],
    },
];

const setUp = async () => {
    const mock = axiosMock.get
        .mockResolvedValueOnce({ data: data })

    const utils = await act(async () => {
        render(
            <HashRouter>
                <Cart />
            </HashRouter>
        );
    });
    return { mock, ...utils };
};

describe("Cart Component", () => {

    it("renders correctly", async () => {

        await setUp();

        screen.getByRole('button', { name: /Eliminar/i });
    });
});
