import React from "react";
import "@testing-library/jest-dom";
import {
    render,
    screen,
    act,
    logRoles,
    cleanup,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import Cart from "../../../components/elements/Cart";

// jest.unmock("axios");
import axiosMock from "axios";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { click } from "@testing-library/user-event/dist/click";
import { Context } from "../../../components/Context";

// jest.mock("axios");

afterEach(cleanup);

let data = [
    {
        id: 1,
        name: "Don Julio 70 700ml",
        price: 650,
        quantity: "2",
        attributes: [],
        conditions: [],
    },
    {
        id: 2,
        name: "Don Julio Blanco 700ml",
        price: 440,
        quantity: "1",
        attributes: [],
        conditions: [],
    },
    {
        id: 3,
        name: "Don Julio Reposado 700ml",
        price: 510,
        quantity: "1",
        attributes: [],
        conditions: [],
    },
];

const setUp = async () => {
    const mock = axiosMock.get.mockResolvedValueOnce({ data: data });

    const utils = await act(async () => {
        render(
            <HashRouter>
                <Context.Provider
                    value={{
                        setLoader: jest.fn(),
                    }}
                >
                    <Cart />
                </Context.Provider>
            </HashRouter>
        );
    });
    return { mock, ...utils };
};

describe("Cart Component", () => {
    it("shows alert msg when total < 1500", async () => {
        // render without mocked cart (no items)
        await act(async () => {
            render(
                <HashRouter>
                    <Cart />
                </HashRouter>
            );
        });

        screen.getByText(/Te faltan MX\$1,500.00 para completar tu pedido/i);
    });

    it("renders correctly with cart items within", async () => {
        await setUp();

        screen.getByText("MX$1,300.00");
        screen.getByRole("heading", { name: /Total MX\$2,250.00/i });
        screen.getAllByRole("button", { name: /Eliminar/i });
    });

    it("alerts for remaining qty", async () => {
        data = [
            {
                id: 1,
                name: "Don Julio 70 700ml",
                price: 650, // total 1,300
                quantity: "2",
                attributes: [],
                conditions: [],
            },
        ];
        await setUp();

        screen.getByText(/Te faltan MX\$200.00 para completar tu pedido/i);
    });
});

describe("add and remove items", () => {
    it("add one more on click", async () => {
        axiosMock.get
            .mockResolvedValueOnce({ data: data })
            .mockResolvedValueOnce({ data: "resolved" }); // andOneMore mocked axios call

        /* fake context and props passed to addOneMore method
        which is called by clicking '¡uno más!' btn */
        let mockContextAndPropFns = {
            // context
            setLoader: () => {},
            getCartContent: () => {},
            notifyMinAmountRemaining: () => {},
            // props
            cartCountUpdate: () => {},
        };

        await act(async () => {
            render(
                <HashRouter>
                    <Context.Provider
                        value={{
                            setLoader: mockContextAndPropFns.setLoader,
                            getCartContent:
                                mockContextAndPropFns.getCartContent,
                            notifyMinAmountRemaining:
                                mockContextAndPropFns.notifyMinAmountRemaining,
                        }}
                    >
                        <Cart
                            cartCountUpdate={
                                mockContextAndPropFns.cartCountUpdate
                            }
                        />
                    </Context.Provider>
                </HashRouter>
            );
        });

        const heading = screen.getByRole("heading", {
            name: `Total MX$1,300.00`,
        });
        expect(heading).toBeInTheDocument();

        const addOneMoreBtn = screen.getByTestId("add-one-more-btn-0");
        act(() => {
            userEvent.click(addOneMoreBtn);
        });
        // wait for DOM to be updated
        waitFor(() => {
            const totalHeading = screen.getByRole("heading", {
                name: `Total MX$1,950.00`,
            });
            expect(totalHeading).toBeInTheDocument();
        });
        // waitFor(() => screen.debug());
    });
});

// it("test btn works", async () => {
//     /* create a btn that onClick calls a 'testMethod'
//     which increases count by every click, thus being able
//     to test if userEvent.click is really triggering the
//     method and asserting via toContainHTML assertion */

//     /* in Cart.js */
//     // const [testState, setTestState] = useState(1);
//     // const testMethod = () => {
//     //     setTestState(testState + 1);
//     // };
//     // <div>
//     //     <button onClick={testMethod}>Test me!</button>
//     //     <p data-testid="state-count">{testState}</p>
//     // </div>;

//     axiosMock.get.mockResolvedValueOnce({ data: data });

//     // const mockedFn = jest.fn(() => Promise.resolve());

//     await act(async () => {
//         render(
//             <HashRouter>
//                 <Cart />
//                 {/* <Cart testMethod={mockedFn}/> */}
//             </HashRouter>
//         );
//     });
//     // screen.debug(); // count 1

//     const testBtn = screen.getByRole("button", { name: /test me!/i });
//     userEvent.click(testBtn);
//     // expect(mockedFn).toHaveBeenCalled();
//     const stateCount = screen.getByTestId('state-count');
//     // screen.debug(); // count 2
//     expect(stateCount).toContainHTML('2');
// });
