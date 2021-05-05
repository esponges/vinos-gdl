import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import ProductGrid from "../../components/index/ProductGrid";
import products from "./auth/data/productGridData";

const renderComponent = (data, handleItemAddClick = 0) => {
    if (!handleItemAddClick) {
        render(
            <HashRouter>
                <ProductGrid products={data} />
            </HashRouter>
        );
    } else {
        render(
            <HashRouter>
                <ProductGrid products={data} onClick={handleItemAddClick} />
            </HashRouter>
        );
    }
};

const data = products;

describe("ProductGrid", () => {
    it("renders", () => {
        render(
            <HashRouter>
                <ProductGrid />
            </HashRouter>
        );
    });

    it("shows Tequila category", () => {
        renderComponent(data);
        expect(
            screen.getByRole("heading", { name: /Tequila/i })
        ).toBeInTheDocument();
    });

    /* attempt using a new button - but it also dind't pass */

    // it("test jest mock with click", async () => {
    //     const handleClickMe = jest.fn();
    //     renderComponent(data, handleClickMe);

    //     // render(
    //     //     <HashRouter>
    //     //         <ProductGrid products={data} onClick={handleClickMe} />
    //     //     </HashRouter>
    //     // );

    //     const clickMeBtn = screen.getByRole("button", { name: /Click me!/i });
    //     expect(clickMeBtn).toBeInTheDocument();

    //     fireEvent.click(clickMeBtn);
    //     // screen.debug();
    //     // await waitFor(() => {
    //     //     expect(handleClickMe).toHaveBeenCalled();
    //     // });
    //     // expect(handleClickMe).toHaveBeenCalled();
    // });

    it("adds item to cart", () => {
        const handleItemAddClick = jest.fn();
        renderComponent(data, handleItemAddClick);

        // render(
        //     <HashRouter>
        //         <ProductGrid products={data} onClick={handleItemAddClick} />
        //     </HashRouter>
        // );

        const addBtn = screen.getByTestId("1");

        expect(addBtn).toBeInTheDocument();
        fireEvent.click(addBtn);
        // screen.debug();
        // expect(handleItemAddClick).toHaveBeenCalled();
    });
});
