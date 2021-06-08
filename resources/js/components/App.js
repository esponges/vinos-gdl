    import React, { useState, useEffect, createContext } from "react";

import ReactDOM from "react-dom";
import { Switch, HashRouter, Route, withRouter } from "react-router-dom";

import SingleProduct from "./elements/SingleProduct";
import Cart from "./elements/Cart";
import Category from "./elements/Category";
import IndexNavbar from "./index/IndexNavbar";
import MastHead from "./index/MastHead";
import ProductGrid from "./index/ProductGrid";
import Footer from "./index/Footer";
import About from "./elements/About";
import ForgotPassword from "./auth/ForgotPassword";
import FAQ from "./elements/FAQ";
import Login from "./auth/Login";
import RegisterForm from "./auth/RegisterForm";

/* SmartPayPalbtn Checkout */
// import Checkout from "./checkout/PayPal/Checkout";

/* Actual checkout (old paypal) */
import Checkout from "./checkout/Checkout";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./Context";
import Legal from "./elements/Legal";

import CancelPayment from "./checkout/PayPal/CancelPayment";
import SuccessfulPayment from "./checkout/PayPal/SuccessfulPayment";
import UnsuccessfulPayment from "./checkout/PayPal/UnsuccessfulPayment";
import { AppModal } from './common/AppModal';

import { useEffectProducts } from "./controls/hooks";
import { useModal } from "./controls/hooks/modal";

import { fetchXML } from "./controls/xmltest";
import { setRepeater, setAllRepeaters } from './controls/setRepeater';

const App = (props) => {
    const [cartTotal, setCartTotal] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState("");

    const [loader, setLoader] = useState(false);

    const {
        products,
        prods,
        error,
        cartCount,
        cart,
        setCartCount,
        getCartContent,
    } = useEffectProducts();

    const modalProps = useModal();

    const addToCart = (id, itemCount) => {
        setLoader(true);
        axios
            .get(`cart/${id}/add/${itemCount}`)
            .then(() => {
                console.log("add to cart! ", id, "item count ", itemCount);
                cartCountUpdate(itemCount);
                getCartContent();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const cartCountUpdate = (qty) => {
        setCartCount(cartCount + qty);
        setLoader(false);
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

    /* Start of Cart total and its toaster */
    const notifyMinAmountRemaining = (amount) => {
        let lastCartTotal = cartTotal;
        let newCartTotal = amount + lastCartTotal;
        setCartTotal(newCartTotal);

        if (newCartTotal < 1500) {
            toast.info(
                `Sólo agrega MX$${
                    1500 - newCartTotal
                } más para proceder al checkout`
            );
        }
    };

    /* General notification */
    const notifyToaster = (variant, msg) => {
        if (variant === "warn") {
            return toast.warn(msg);
        } else if (variant === "success") {
            return toast.success(msg);
        } else if (variant === "error") {
            return toast.error(msg);
        } else {
            return toast.info(msg);
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
        // const fetchData = async() => {
        //     const song = await fetchXML("http://127.0.0.1:8000/Angeline-the-Baker.musicxml");
        //     setAllRepeaters(song);
        //     setRepeater(song, song[46][0], 46);
        // }
        // fetchData();

        getCartTotal();
    }, [cartTotal]);
    /* End of Cart total and its toaster */

    //cleanup will cause reloading hook so will create one separated
    useEffect(() => {
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
                    addToCart: addToCart,
                    allProducts: prods,
                    cartContent: cart,
                    cartTotal: cartTotal,
                    cartCountUpdate: cartCountUpdate,
                    getCartContent: getCartContent,
                    setCartCount: setCartCount,
                    notifyMinAmountRemaining: notifyMinAmountRemaining,
                    notifyToaster: notifyToaster,
                    loader: loader,
                    setLoader: setLoader,
                    openModal: modalProps.openModal,
                    closeModal: modalProps.closeModal,
                }}
            >
                <AppModal {...modalProps}/>
                <IndexNavbar
                    cartCount={cartCount}
                    userLogged={loggedIn}
                    userInfo={userInfo}
                    logout={logout}
                />
                <ToastContainer position="top-center" />
                <div className="container mb-5 body-margin-top">
                    <Switch>
                        <Route path="/products/:id">
                            <div className="container"></div>
                            <SingleProduct />
                        </Route>

                        <Route path="/categories/:name">
                            <Category />
                        </Route>

                        <Route path="/checkout">
                            <Route path="/checkout/cancel">
                                <CancelPayment />
                            </Route>
                            <Route path="/checkout/success/:id">
                                <SuccessfulPayment />
                            </Route>
                            <Route path="/checkout/fail">
                                <UnsuccessfulPayment />
                            </Route>
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

                        <Route path="/legal">
                            <Legal />
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
