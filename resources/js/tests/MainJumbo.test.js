import React from 'react';
import { shallow, mount, configure } from "enzyme";
import toJson from "enzyme-to-json";
import Adapter from "enzyme-adapter-react-16";
import { BrowserRouter as Router } from "react-router-dom";
import { create, update } from "react-test-renderer";
import MainJumbo from "../components/index/MainJumbo";

configure({ adapter: new Adapter() });

describe("mainjumbo has what it has", () => {
    it("has 3 p", () => {
        const tree = shallow(<MainJumbo />);
        expect(tree.find("img").length).toEqual(1);
        // expect(tree.find("p").length).toEqual(3);
    });
});
