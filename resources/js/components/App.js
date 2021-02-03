import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Switch, HashRouter, Route, withRouter } from "react-router-dom";
import SingleProduct from "./elements/SingleProduct";
import Cart from "./elements/Cart";
import Checkout from "./elements/Checkout.js";
import IndexNavbar from "./index/IndexNavbar";
import MastHead from "./index/MastHead";
import ProductGrid from "./index/ProductGrid";
import MainJumbo from "./index/MainJumbo";
import Footer from "./index/Footer";
import axios from "axios";
import Login from "./auth/Login";
import RegisterForm from "./auth/RegisterForm";
import Category from "./elements/Category";

const App = (props) => {
    const [products, setProducts] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState("");
    const [style, setStyle] = useState(15);

    const cartCountUpdate = (qty) => {
        setCartCount(cartCount + qty);
    };

    const login = () => {
        setLoggedIn(true);
        axios
            .get("api/user-name")
            .then((res) => {
                setUserInfo(Object.values(res.data));
            })
            .catch((err) => {
                console.error(err, " in login method");
            });
    };

    const logout = () => {
        setLoggedIn(false);
    };

    useEffect(() => {
        axios
            .get("/categories")
            .then((res) => {
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
        axios.get("/cart/get-total").then((res) => {
            setCartTotal(res.data);
        });
        if (`${location.host}/#/home`)
            setStyle(3);
    }, []);

    //cleanup will cause reloading hook so will create one separated
    useEffect(() => {
        axios.get("api/is-auth").then((res) => {
            if (res.data) {
                setLoggedIn(true);
                axios
                    .get("api/user-name")
                    .then((res) => {
                        setUserInfo(Object.values(res.data));
                    })
                    .catch((err) => {
                        console.error(err, " in login method");
                    });
            }
        });
    }, [loggedIn]);

    return (
        <HashRouter>
            <IndexNavbar
                cartCount={cartCount}
                userLogged={loggedIn}
                userInfo={userInfo}
                logout={logout}
            />
            <div className="container mb-5" style={{ marginTop: `${style}%` }}>
                <Switch>
                    <Route path="/products/:id">
                        <div
                            className="container"
                            style={{ marginTop: "18%" }}
                        ></div>
                        <SingleProduct cartCountUpdate={cartCountUpdate} />
                    </Route>
                    <Route path="/categories/:name">
                        <div
                            className="container"
                            style={{ marginTop: "18%" }}
                        ></div>
                        <Category />
                    </Route>
                    <Route path="/cart">
                        <div
                            className="container"
                            style={{ marginTop: "15%" }}
                        ></div>
                        <Cart cartCountUpdate={cartCountUpdate} />
                        <Route path="/cart/checkout">
                            <Checkout loggedIn={loggedIn} userInfo={userInfo} />
                        </Route>
                    </Route>
                    <Route path="/login">
                        <Login
                            loggedIn={loggedIn}
                            login={login}
                            cartCount={cartCount}
                        />
                    </Route>
                    <Route path="/register">
                        <RegisterForm />
                    </Route>
                    <Route path="/">
                        <div className="index-page">
                            <MainJumbo />
                            <MastHead />
                            <ProductGrid
                                products={products}
                                cartCountUpdate={cartCountUpdate}
                            />
                        </div>
                    </Route>
                </Switch>
            </div>
            <Footer />
        </HashRouter>
    );
};

export default withRouter(App);

ReactDOM.render(<App />, document.getElementById("root"));
