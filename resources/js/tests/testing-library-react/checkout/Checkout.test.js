import React from "react";
import "@testing-library/jest-dom";
import {
    screen,
    render,
    act,
    cleanup,
    getByRole,
    fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import Checkout from "../../../components/checkout/Checkout";

// jest.unmock("axios"); // unmock from previous test
import axiosMock from "axios";
jest.mock("axios");

// faked props
const userInfo = {
    // these two come with real user info
    userName: "paco",
    userEmail: "paco@example.com",

    // these are faked since I can't set them
    // via their respective components (dropdown-select)
    // and downshift select
    CP: "123",
    neighborhood: 'Barrio bravo',
    deliveryDay: "Lunes",
    deliverySchedule: "10 a 2",
};
let loggedIn = true;

const deliveryDays = [
    {
        id: 1,
        label: "Próximo Lunes",
        value: 1,
        created_at: null,
        updated_at: null,
        is_hidden: 0,
    },
];

let total = 1600;
const subtotal = 120;

const setUp = async () => {
    const mock = axiosMock.get
        .mockResolvedValueOnce({ data: total })
        .mockResolvedValueOnce({ data: subtotal })
        .mockResolvedValueOnce({ data: deliveryDays });

    const utils = await act(async () => {
        render(
            <HashRouter>
                <Checkout userInfo={userInfo} loggedIn={loggedIn} />
            </HashRouter>
        );
    });
    return { mock, ...utils };
};

afterEach(cleanup);

describe("Checkout Component", () => {
    test("renders form with successful axios calls", async () => {
        await setUp();
        const totalHeading = screen.getByTestId("top-total-header", {
            name: `Total MX$${total}`,
        });
        expect(totalHeading).toBeInTheDocument();
    });

    it("user can fill all inputs and generate order", async () => {
        await setUp();

        // phone input
        const phoneInput = screen.getByPlaceholderText(/ingresa tu teléfono/i);
        userEvent.type(phoneInput, "1234567890");
        expect(phoneInput).toHaveValue("1234567890");

        // streetName input
        const streetNameInput = screen.getByPlaceholderText(
            /La dirección de tu casa/i
        );
        // fireEvent.change(streetNameInput, { target: { value: 'Hidalguito' }});
        userEvent.type(streetNameInput, "Hidalguito"); // using type method from user-event library
        expect(streetNameInput).toHaveValue("Hidalguito");

        // streetNumber input
        const streetNumberInput = screen.getByPlaceholderText(
            /El número de la dirección/i
        );

        userEvent.type(streetNumberInput, "1");
        expect(streetNumberInput).toHaveValue("1");

        // more address details
        const addressDetails = screen.getByPlaceholderText(
            /Para dar más fácilmente contigo/i
        );

        userEvent.type(addressDetails, "Biiig house");
        expect(addressDetails).toHaveValue("Biiig house");

        // check if button is not disable
        const orderBtn = screen.getByRole("button", { name: /generar orden/i });
        expect(orderBtn).not.toBeDisabled();

        //fire order!!
        // screen.debug();
        // fireEvent.click(orderBtn);
        // userEvent.click(orderBtn);
        // expect(orderBtn).toHaveBeenCalled();
    });

    it("user can't generate order without completing form inputs (phone)", async () => {
        await setUp();

        /* intentionally not filling phone */
        // const phoneInput = screen.getByPlaceholderText(/ingresa tu teléfono/i);
        // userEvent.type(phoneInput, "1234567890");
        // expect(phoneInput).toHaveValue("1234567890");

        // streetName input
        const streetNameInput = screen.getByPlaceholderText(
            /La dirección de tu casa/i
        );
        // fireEvent.change(streetNameInput, { target: { value: 'Hidalguito' }});
        userEvent.type(streetNameInput, "Hidalguito"); // using type method from user-event library
        expect(streetNameInput).toHaveValue("Hidalguito");

        // streetNumber input
        const streetNumberInput = screen.getByPlaceholderText(
            /El número de la dirección/i
        );

        userEvent.type(streetNumberInput, "1");
        expect(streetNumberInput).toHaveValue("1");

        // more address details
        const addressDetails = screen.getByPlaceholderText(
            /Para dar más fácilmente contigo/i
        );

        userEvent.type(addressDetails, "Biiig house");
        expect(addressDetails).toHaveValue("Biiig house");

        // check if button is not disable
        const orderBtn = screen.getByRole("button", {
            name: /generar orden/i,
        });
        expect(orderBtn).toBeDisabled();
    });

    it('cant see form if cartTotal < 1500', async () => {
        total = 1499;
        await setUp();

        const minCartTotalAlert = screen.getByRole('alert', /No has completado tu compra mínima de MX$1,5000/i);
        expect(minCartTotalAlert).toBeInTheDocument();
    });

    it('cant see form if not logged in', async () => {
        loggedIn = false;
        await setUp();

        // screen.debug();
        const pleaseLogIn = screen.getByRole('heading', /regístrate/i);
        expect(pleaseLogIn).toBeInTheDocument();
    });
});
