import React from "react";
import "@testing-library/jest-dom";
import { act, render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";

import { Context } from "../../../components/Context";
import { HashRouter, Route } from "react-router-dom";

import SuccessfulPayment from "../../../components/checkout/PayPal/SuccessfulPayment";
import Checkout from "../../../components/checkout/Checkout";

jest.mock("axios");
jest.useRealTimers();

const userInfo = {
    // these two come with real user info
    userName: "paco",
    userEmail: "paco@example.com",

    // these are faked since I can't set them
    // via their respective components (dropdown-select)
    // and downshift select
    CP: "123",
    neighborhood: "Barrio bravo",
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

let total = 2250;
const subtotal = 120;

const contextMockFns = {
    notifyToaster: () => {},
    setCartCount: () => {},
};

const setUp = async () => {
    const mock = axios.get
        .mockResolvedValueOnce({ data: total })
        .mockResolvedValueOnce({ data: subtotal })
        .mockResolvedValueOnce({ data: deliveryDays });

    const resp = { data: 2121 };
    // axios.post.mockResvoledValueOnce({ data: 2121 });
    const mockPost = axios.post
        .mockResolvedValueOnce(resp)
        .mockResolvedValueOnce("admin emails");

    //     createBrowserHi

    // const history = createMemoryHistory();
    // history.push('/');

    const utils = await act(async () => {
        render(
            <HashRouter>
                <Context.Provider
                    value={{
                        notifyToaster: contextMockFns.notifyToaster,
                        setCartCount: contextMockFns.setCartCount,
                    }}
                >
                    <Checkout userInfo={userInfo} loggedIn={loggedIn} history={history.push} />
                    <Route path="/checkout/success/:id">
                        {/* <div>SuccessfulPayment page</div> */}
                        <SuccessfulPayment />
                    </Route>
                </Context.Provider>
            </HashRouter>
        );
    });
    return { mock, mockPost, ...utils };
};

const fillInputs = () => {
    // phone input
    const phoneInput = screen.getByPlaceholderText(/ingresa tu teléfono/i);

    // streetName input
    const streetNameInput = screen.getByPlaceholderText(
        /La dirección de tu casa/i
    );

    // streetNumber input
    const streetNumberInput = screen.getByPlaceholderText(
        /El número de la dirección/i
    );

    // more address details
    const addressDetails = screen.getByPlaceholderText(
        /Para dar más fácilmente contigo/i
    );

    return { phoneInput, streetNameInput, streetNumberInput, addressDetails };
};

afterEach(cleanup);

it("user can fill all inputs and generate order and generates it correctly", async () => {
    await setUp();

    const {
        phoneInput,
        streetNameInput,
        streetNumberInput,
        addressDetails,
    } = fillInputs();

    userEvent.type(phoneInput, "1234567890");
    expect(phoneInput).toHaveValue("1234567890");

    userEvent.type(streetNameInput, "Hidalguito"); // using type method from user-event library
    expect(streetNameInput).toHaveValue("Hidalguito");

    userEvent.type(streetNumberInput, "1");
    expect(streetNumberInput).toHaveValue("1");

    userEvent.type(addressDetails, "Biiig house");
    expect(addressDetails).toHaveValue("Biiig house");

    // check if button is not disable
    const orderBtn = screen.getByRole("button", { name: /generar orden/i });
    expect(orderBtn).not.toBeDisabled();

    /* Generate order */
    userEvent.click(orderBtn);
    waitFor(() => {
        document.getElementById('loader-container').value = 'loader';
        const loaderEl = screen.getByDisplayValue('loader');
    });
});
