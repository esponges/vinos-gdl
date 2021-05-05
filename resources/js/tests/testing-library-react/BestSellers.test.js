import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";

import React from "react";
import { HashRouter } from "react-router-dom";
import { Context } from "../../components/Context.js";
import BestSellers from "../../components/index/BestSellers.js";
import products from "./auth/data/productGridData";


describe("Best Sellers", () => {
    it("renders", async () => {
        render(
            <HashRouter>
                <Context.Provider value={{
                    allProducts: products,
                }}>
                    <BestSellers />
                </Context.Provider>
            </HashRouter>
        );

        // screen.debug();
        // screen.getByText('Best Sellers');
    });
});
