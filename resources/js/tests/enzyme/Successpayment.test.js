import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SuccessfulPayment from "../../components/checkout/PayPal/SuccessfulPayment";
import { MemoryRouter } from "react-router";

configure({ adapter: new Adapter() });

describe("SuccessfulPayment", () => {
    beforeAll(() => {
        const component = shallow(
            <MemoryRouter>
                <SuccessfulPayment />
            </MemoryRouter>
        );
    })

    it("renders", () => {
        shallow(
            <MemoryRouter>
                <SuccessfulPayment />
            </MemoryRouter>
        );
    });

    it('accepts props', () => {
        const props = 12345;

        shallow(
            <MemoryRouter>
                <SuccessfulPayment props={props} />
            </MemoryRouter>
        );
    });
});
