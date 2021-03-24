import React, { useState, useEffect } from "react";

import ReactDOM from "react-dom";
import { Switch, HashRouter, Route, withRouter } from "react-router-dom";

import SingleProduct from "./elements/SingleProduct";
import Cart from "./elements/Cart";
import Category from "./elements/Category";
import Checkout from "./checkout/Checkout.js";
import IndexNavbar from "./index/IndexNavbar";
import MastHead from "./index/MastHead";
import ProductGrid from "./index/ProductGrid";
import Footer from "./index/Footer";
import About from "./elements/About";
import ForgotPassword from "./auth/ForgotPassword";
import FAQ from "./elements/FAQ";
import Login from "./auth/Login";
import RegisterForm from "./auth/RegisterForm";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./Context";


const App = (props) => {
    const [products, setProducts] = useState(null);
    const [prods, setProds] = useState("");
    const [cart, setCart] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState("");

    const addToCart = (id, itemCount) => {
        console.log("add to cart! ", id, "item count ", itemCount);
        axios
            .get(`cart/${id}/add/${itemCount}`)
            .then(() => {
                // console.log(res.data, 'added to cart!!!');
                cartCountUpdate(itemCount);
                getCartContent();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const getCartContent = async () => {
        const res = await axios
            .get("cart")
            .then((res) => {
                setCart(Object.values(res.data));
            })
            .catch((err) => {
                console.error(err);
            });
        return res;
    };

    const cartCountUpdate = (qty) => {
        setCartCount(cartCount + qty);
    };

    const login = () => {
        setLoggedIn(true);
        console.log("props.login");
        axios
            .get("api/user-info")
            .then((res) => {
                setUserInfo(res.data);
            })
            .catch((err) => {
                console.error(err, " in login method");
            });
    };

    const logout = () => {
        setLoggedIn(false);
        setCartCount(0);
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
            .get("/products")
            .then((res) => {
                setProds(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        getCartContent();

        axios.get("/cart/count").then((res) => {
            setCartCount(res.data[0]);
        });
    }, []);

    /* Start of Cart total and its toaster */
    const notifyMinAmountRemaining = (amount) => {
        let lastCartTotal = cartTotal;
        let newCartTotal = amount + lastCartTotal;
        setCartTotal(newCartTotal);

        if (newCartTotal < 1500) {
            toast.info(
                `Sólo agrega MX${
                    1500 - newCartTotal
                } más para proceder al checkout`
            );
        }
    };

    const getCartTotal = async () => {
        const res = await axios
            .get("/cart/get-total")
            .then((res) => {
                setCartTotal(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
        return res;
    };

    useEffect(() => {
        getCartTotal();
    }, [cartTotal]);
    /* End of Cart total and its toaster */

    //cleanup will cause reloading hook so will create one separated
    useEffect(() => {
        console.log("useeffect from App.js - loggedIn state changed.");
        axios.get("api/is-auth").then((res) => {
            if (res.data) {
                setLoggedIn(true);
                axios
                    .get("api/user-info")
                    .then((res) => {
                        setUserInfo(res.data);
                    })
                    .catch((err) => {
                        console.error(err, " in login method");
                    });
            }
        });
    }, [loggedIn]);

    return (
        <HashRouter>
            <Context.Provider
                value={{
                    cartContent: cart,
                    allProducts: prods,
                    cartTotal: cartTotal,
                    addToCart: addToCart,
                    cartCountUpdate: cartCountUpdate,
                    getCartContent: getCartContent,
                    notifyMinAmountRemaining: notifyMinAmountRemaining,
                }}
            >
                <IndexNavbar
                    cartCount={cartCount}
                    userLogged={loggedIn}
                    userInfo={userInfo}
                    logout={logout}
                />
                <ToastContainer />
                <div
                    className="container mb-5 body-margin-top"
                    // style={{ marginTop: `22%` }}
                >
                    <Switch>
                        <Route path="/products/:id">
                            <div className="container"></div>
                            <SingleProduct />
                        </Route>

                        <Route path="/categories/:name">
                            <Category />
                        </Route>

                        <Route path="/cart/checkout">
                            <Checkout loggedIn={loggedIn} userInfo={userInfo} />
                        </Route>

                        <Route path="/cart">
                            <Cart cartCountUpdate={cartCountUpdate} />
                        </Route>

                        <Route path="/forgot-password">
                            <ForgotPassword />
                        </Route>

                        <Route path="/login">
                            <Login
                                loggedIn={loggedIn}
                                login={login}
                                cartCount={cartCount}
                            />
                        </Route>

                        <Route path="/register">
                            <RegisterForm login={login} />
                        </Route>

                        <Route path="/FAQ">
                            <FAQ />
                        </Route>

                        <Route path="/about">
                            <About />
                        </Route>

                        <Route path="/">
                            <MastHead />
                            <ProductGrid products={products} />
                        </Route>
                    </Switch>
                </div>
                <Footer />
            </Context.Provider>
        </HashRouter>
    );
};

export default withRouter(App);

ReactDOM.render(<App />, document.getElementById("root"));
