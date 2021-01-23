import React, { useState, useEffect } from "react";
import Home from "./Home";
import ReactDOM from "react-dom";
import { Switch, HashRouter, Route } from "react-router-dom";
import SingleProduct from "./elements/SingleProduct";
import Cart from "./elements/Cart";
import Checkout from "./elements/Checkout.js";
import IndexNavbar from "./index/IndexNavbar";
import MastHead from "./index/MastHead";
import ProductGrid from "./index/ProductGrid";
import MainJumbo from "./index/MainJumbo";
import Footer from "./index/Footer";
import axios from "axios";
import { get } from "jquery";

const App = () => {
    const [products, setProducts] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [error, setError] = useState("");

    const cartCountUpdate = () => {
        setCartCount(cartCount + 1);
    }


    useEffect(() => {
        axios
            .get("/categories")
            .then((res) => {
                // console.log(res.data[0].id)
                setProducts(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
        axios
            .get("/cart")
            .then((res) => {
                setCart(Object.values(res.data));
            })
            .catch(err => {
                console.error(err);
            })
        axios
            .get("/cart/count")
            .then(res => {
                setCartCount(res.data[0]);
            })
    }, []);

    return (
        <HashRouter>
            <IndexNavbar cartCount={cartCount} />
            <Switch>
                <Route path="/products/:id">
                    <div
                        className="container"
                        style={{ marginTop: "18%" }}
                    ></div>
                    <SingleProduct />
                </Route>
                <Route path="/cart/checkout">
                    <Checkout />
                </Route>
                <Route path="/cart">
                    <div
                        className="container"
                        style={{ marginTop: "15%" }}
                    ></div>
                    <Cart cart={cart} />
                </Route>
                <Route path="/">
                    <MainJumbo />
                    <MastHead />
                    <ProductGrid
                        products={products}
                        cartCountUpdate={cartCountUpdate}
                    />
                </Route>
            </Switch>
            <Footer />
        </HashRouter>
    );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
