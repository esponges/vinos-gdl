import React from "react";
import Home from "./Home";
import ReactDOM from 'react-dom';
import { Switch, HashRouter, Route } from "react-router-dom";
import SingleProduct from "./detail/SingleProduct";

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/products/:id">
                    <SingleProduct />
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
