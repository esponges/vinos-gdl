import React from "react";
import About from "../../components/elements/About";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";

configure({ adapter: new Adapter() });

describe('about', () => {

    // beforeEach(() => {
    //     const wrapper = shallow(<About />)
    // });

    it('renders', () => {
        const wrapper = shallow(<About />);

        expect(toJson(wrapper)).toMatchSnapshot();
    })
});
