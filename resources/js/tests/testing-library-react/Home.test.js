import React from "react";
import { screen, render, cleanup, act, waitFor } from "@testing-library/react";
import userEvent, { fireEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { HashRouter, Switch, Route } from "react-router-dom";
import { Context } from "../../components/Context";
import Footer from "../../components/index/Footer";
import IndexNavbar from "../../components/index/IndexNavbar";
import MastHead from "../../components/index/MastHead";
import ProductGrid from "../../components/index/ProductGrid";
import products from "./auth/data/productGridData";
import categoryList from "./helpers";

import mockAxios from "axios";

beforeEach(cleanup);

let IndexNavbarProps = {
    cartCount: 0,
    userLogged: true,
    userInfo: {
        userEmail: "esponges@gmail.com",
        userName: "Haleigh Kutch",
        userPhone: null,
    },
    logout: () => {},
};
const { cartCount, userLogged, userInfo, logout } = IndexNavbarProps;

let contextProps = {
    allProducts: products,
    addToCart: () => {},
    getCartContent: () => {},
    notifyMinAmountRemaining: () => {},
};

const {
    allProducts,
    addToCart,
    getCartContent,
    notifyMinAmountRemaining,
} = contextProps;

const setup = async () => {
    const mockCreate = mockAxios.create.mockResolvedValueOnce({
        data: "mocked ",
    });
    const mockGet = mockAxios.get.mockResolvedValueOnce({ data: categoryList });

    const utils = act(async () => {
        render(
            <HashRouter>
                <Context.Provider
                    value={{
                        allProducts: products,
                        addToCart: jest.fn(),
                        getCartContent: jest.fn(),
                        notifyMinAmountRemaining: jest.fn(),
                    }}
                >
                    <IndexNavbar
                        cartCount={cartCount}
                        userLogged={userLogged}
                        userInfo={userInfo}
                        logout={logout}
                    />
                    <Switch>
                        <Route path="/">
                            <MastHead />
                            <ProductGrid products={products} />
                        </Route>
                    </Switch>
                    <Footer />
                </Context.Provider>
            </HashRouter>
        );
    });

    return { mockCreate, mockGet, ...utils };
};

describe("Index integration test", () => {
    it("renders with all components mounted", async () => {
        await setup();

        /* Navbar els */
        const userName = screen.getByRole("button", {
            name: userInfo.userName,
        });
        expect(userName).toBeInTheDocument();

        const topCartCount = screen.getByRole("link", { name: cartCount });
        expect(topCartCount).toBeInTheDocument();

        const floatingCartCount = screen.getByTestId("floating-cart-count");
        expect(floatingCartCount).toContainHTML("0");

        /* MastHead el */
        const mastHeadEl = screen.getByTestId("vinoreo-logo-header");
        expect(mastHeadEl).toBeInTheDocument();

        /* Product grid el */
        const productGridEl = screen.getByText("Don Julio 70 700ml");
        expect(productGridEl).toBeInTheDocument();
    });

    it.skip('adds to cart an item onClick "add/añadir" btn', async () => {
        await setup();

        let floatingCartCount = screen.getByTestId("floating-cart-count");
        expect(floatingCartCount).toContainHTML("0");

        const productId = products[0][0].products[0].id;
        const addToCartBtn = screen.getByTestId(`main-add-btn-${productId}`);
        userEvent.click(addToCartBtn);


        await waitFor(() => {
            floatingCartCount = screen.getByTestId("floating-cart-count");
        });
        expect(floatingCartCount).toContainHTML("1");
    });
});
