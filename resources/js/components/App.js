import React from "react";
import Home from "./Home";
import ReactDOM from 'react-dom';
import { Switch, HashRouter, Route } from "react-router-dom";
import SingleProduct from "./elements/SingleProduct";
import Cart from "./elements/Cart";
import Checkout from "./elements/Checkout.js";

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/products/:id">
                    <SingleProduct />
                </Route>
                <Route path="/cart/checkout">
                    <Checkout />
                </Route>
                <Route path="/cart">
                    <Cart />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </HashRouter>
    );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
