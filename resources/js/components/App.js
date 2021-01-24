import React, { useState, useEffect } from "react";
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
import Login from './auth/Login';

const App = () => {
    const [products, setProducts] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const cartCountUpdate = () => {
        setCartCount(cartCount + 1);
    };

    const login = () => {
        setLoggedIn(true);
        console.log('im now logged in')
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
            .catch((err) => {
                console.error(err);
            });
        axios.get("/cart/count").then((res) => {
            setCartCount(res.data[0]);
        });
        axios.get("api/is-auth")
        .then(res => {
            if (res.data) {
                setLoggedIn(true);
            }
            console.log(res.data)
        })
    }, []);

    return (
        <HashRouter>
            <IndexNavbar cartCount={cartCount} />
            <div className="container" style={{ marginTop: "15%" }}>
                <Switch>
                    <Route path="/products/:id">
                        <div
                            className="container"
                            style={{ marginTop: "18%" }}
                        ></div>
                        <SingleProduct />
                    </Route>
                    <Route path="/cart/checkout">
                        <Checkout loggedIn={loggedIn} />
                    </Route>
                    <Route path="/cart">
                        <div
                            className="container"
                            style={{ marginTop: "15%" }}
                        ></div>
                        <Cart cart={cart} />
                    </Route>
                    <Route path="/login">
                        <Login loggedIn={loggedIn} login={login}/>
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
            </div>
            <Footer />
        </HashRouter>
    );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
