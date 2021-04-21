import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { HashRouter } from "react-router-dom";
import Login from "../../../components/auth/Login";

const renderComponent = (loggedIn = Boolean, handleSubmit = 0) => {

    if (!handleSubmit)  {
        render(
            <HashRouter>
                <Login loggedIn={loggedIn} />
            </HashRouter>
        );
    } else {
        render(
            <HashRouter>
                <Login loggedIn={loggedIn} onSubmit={handleSubmit}/>
            </HashRouter>
        );
    }
};

describe("Login View", () => {
    it("renders", () => {
        renderComponent(true);
    });

    it("shows greeting if logged in", () => {
        renderComponent(true);
        const heading = screen.getByRole("heading", {
            name: /Bienvenido a Vinoreo/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("prompt user to log in if not logged in", () => {
        renderComponent(false);
        // screen.debug();
        const button = screen.getByRole("button", { name: /Iniciar sesión/i });
        expect(button).toBeInTheDocument();
    });

    it("sets user when typing within input", () => {
        renderComponent(false);
        const inputEl = screen.getByPlaceholderText(
            /Ingresa tu correo electrónico/i
        );
        // screen.debug();
        expect(inputEl.value).toBe("");
        fireEvent.change(inputEl, { target: { value: "user@example.com" } });
        expect(inputEl.value).toBe("user@example.com");
        // fireEvent.input('')
    });

    it("sets password when typing within input", () => {
        renderComponent(false);
        const inputEl = screen.getByPlaceholderText(/Ingresa tu contraseña/i);
        // screen.debug();
        expect(inputEl.value).toBe("");
        fireEvent.change(inputEl, { target: { value: "123456" } });
        expect(inputEl.value).toBe("123456");
        // fireEvent.input('')
    });

    it("can't fire login button", () => {
        // mock submit
        const handleSubmit = jest.fn();
        renderComponent(false, handleSubmit);

        const loginBtn = screen.getByRole("button", {
            name: /Iniciar sesión/i,
        });

        fireEvent.click(loginBtn);

        expect(handleSubmit).not.toBeCalled();
    });

    it("submit with login btn", async () => {
        //mock submit
        const handleSubmit = jest.fn();

        renderComponent(false, handleSubmit);

        // fill email input
        const emailInput = screen.getByPlaceholderText(
            /Ingresa tu correo electrónico/i
        );
        fireEvent.change(emailInput, {
            target: { value: "user@example.com" },
        });
        // fill password input
        const pwInput = screen.getByPlaceholderText(/Ingresa tu contraseña/i);
        fireEvent.change(pwInput, { target: { value: "123456" } });

        const loginBtn = screen.getByRole("button", {
            name: /Iniciar sesión/i,
        });

        // assert values
        expect(emailInput.value).toBe('user@example.com');
        expect(pwInput.value).toBe('123456');
        expect(loginBtn).toBeInTheDocument();

        /* CAN'T ASSERT!!!!!! */
        // fireEvent.submit(loginBtn);

        // await waitFor(() =>
        //     expect(handleSubmit).toBeCalled()
        // )
    });
});
