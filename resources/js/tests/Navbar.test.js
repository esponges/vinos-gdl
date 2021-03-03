import React from 'react';
import IndexNavbar from '../components/index/IndexNavbar';
import { shallow, mount, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { Badge, Button } from 'react-bootstrap';
import { BrowserRouter as Router } from "react-router-dom";
import { create, update } from 'react-test-renderer';
import MainJumbo from '../components/index/MainJumbo';

configure({ adapter: new Adapter() });

const props = {
    cartCount: 1
};

describe('navbar renders', () => {
    it('renders', () => {
        shallow(<IndexNavbar />);
    });

    // it('has a cart button', () => {
    //     const wrapper = shallow(<IndexNavbar props={props.cartCount}/>);
    //     const brand = wrapper.find("#nav-brand").text();
    //     expect(brand).toEqual("VINOREO");
    // })
});

describe ('passing props', () => {
    const navbarWrapper = mount(
        <Router>
            <IndexNavbar items={props} />
        </Router>
    );
    // console.log(navbarWrapper.props().children.props.items)
    it ('navbar accepts props', () => {
        expect(Object.values(navbarWrapper.props().children.props.items)).toContain(props.cartCount);
    });
})

describe('snapshots', () => {
    it('navbar snapshot', () => {
        const tree = shallow(<IndexNavbar />);
        expect(toJson(tree)).toMatchSnapshot();
    });
});

describe('badge shows badge number', () => {
    const wrapper = mount(
        <Router>
            <IndexNavbar items={props} />
        </Router>
    );
    // console.log(wrapper.find(<Badge />).first().text());
    expect(wrapper.find(<Badge />)).toBeTruthy();
});

// describe('navbar toggles', () => {
//     it('toggles from light to dark', () => {
//         const wrapper = mount(
//             <Router>
//                 <IndexNavbar items={props} />
//             </Router>
//         );
//         // console.log(wrapper.debug());
//         // const instance = wrapper.dive();
//         expect(wrapper.state.navbar).toBe(false);
//         // const toggleBg = jest.fn();
//         // const wrapper = mount(
//         //     <Router>
//         //         <IndexNavbar items={props} />
//         //     </Router>
//         // );
//     });
// });


