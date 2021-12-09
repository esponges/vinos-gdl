/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect } from 'react';

import { Switch, Route, withRouter } from 'react-router-dom';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import SingleProduct from './elements/SingleProduct';
import Cart from './elements/Cart';
import MastHead from './index/MastHead';
import Category from './elements/Category';
import IndexNavbar from './index/IndexNavbar';
import ProductGrid from './index/ProductGrid';
import Footer from './index/Footer';
import About from './elements/About';
import ForgotPassword from './auth/ForgotPassword';
import FAQ from './elements/FAQ';
import Login from './auth/Login';
import RegisterForm from './auth/RegisterForm';

/* SmartPayPalbtn Checkout */
// import Checkout from "./checkout/PayPal/Checkout";

/* Actual checkout (old paypal) */
import Checkout from './checkout/Checkout';

import 'react-toastify/dist/ReactToastify.css';

import { Context } from './Context';
import Legal from './elements/Legal';

import CancelPayment from './checkout/PayPal/CancelPayment';
import SuccessfulPayment from './checkout/PayPal/SuccessfulPayment';
import UnsuccessfulPayment from './checkout/PayPal/UnsuccessfulPayment';
import { fetchCartItems } from '../store/cart/reducers';
import ProductList from './elements/ProductList';

const App = function () {
  const dispatch = useDispatch();
  const productsByCategories = useSelector((state) => state.categories.categories);
  const cartItemCount = useSelector((state) => state.cart.cartTotal);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [loader, setLoader] = useState(false);

  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(cartItemCount);

  const cartCountUpdate = (qty) => {
    setCartCount(cartCount + qty);
    setLoader(false);
  };

  const addToCart = (id, itemCount) => {
    setLoader(true);
    axios
      .get(`cart/${id}/add/${itemCount}`)
      .then(() => {
        cartCountUpdate(itemCount);
        dispatch(fetchCartItems());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const login = () => {
    setLoggedIn(true);
    axios
      .get('api/user-info')
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error(err, ' in login method');
      });
  };

  const logout = () => {
    setLoggedIn(false);
    setCartCount(0);
  };

  /* Start of Cart total and its toaster */
  const notifyMinAmountRemaining = (amount/* , oldCartTotal = null */ /* todo */) => {
    const lastCartTotal = cartTotal;
    const newCartTotal = amount + lastCartTotal;
    setCartTotal(newCartTotal);

    if (newCartTotal < 1500) {
      toast.info(
        `Sólo agrega MX${1500 - newCartTotal
        } más para proceder al checkout`,
      );
    }
  };

  /* General notification */
  const notifyToaster = (variant, msg) => {
    if (variant === 'warn') {
      return toast.warn(msg);
    } if (variant === 'success') {
      return toast.success(msg);
    } if (variant === 'error') {
      return toast.error(msg);
    }
    return toast.info(msg);
  };

  const getCartTotal = async () => {
    const res = await axios
      .get('/cart/get-total')
      .then((response) => {
        setCartTotal(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
    return res;
  };

  useEffect(() => {
    getCartTotal();
    setCartCount(cartItemCount);
  }, [cartTotal]);
  /* End of Cart total and its toaster */

  // cleanup will cause reloading hook so will create one separated
  useEffect(() => {
    axios.get('api/is-auth').then((res) => {
      if (res.data) {
        setLoggedIn(true);
        axios
          .get('api/user-info')
          .then((resp) => {
            setUserInfo(resp.data);
          })
          .catch((err) => {
            console.error(err, ' in login method');
          });
      }
    });
  }, [loggedIn]);

  return (
    <Context.Provider
      value={
        {
          cartCountUpdate,
          addToCart,
          cartTotal,
          setCartCount,
          notifyMinAmountRemaining,
          notifyToaster,
          loader,
          setLoader,
        }
      }
    >
      <IndexNavbar
        cartCount={cartCount}
        userLogged={loggedIn}
        userInfo={userInfo}
        logout={logout}
      />
      <ToastContainer position="top-center" />
      <div className="container mb-5 body-margin-top">
        <Switch>
          <Route path="/products/:id" component={SingleProduct} />
          <Route path="/products" component={ProductList} />

          <Route path="/categories/:name" component={Category} />

          <Route path="/checkout">
            <Route path="/checkout/cancel" component={CancelPayment} />
            <Route path="/checkout/success/:id" component={SuccessfulPayment} />
            <Route path="/checkout/fail" component={UnsuccessfulPayment} />
          </Route>

          <Route path="/cart/checkout">
            <Checkout loggedIn={loggedIn} userInfo={userInfo} />
          </Route>

          <Route path="/cart">
            <Cart cartCountUpdate={cartCountUpdate} />
          </Route>

          <Route path="/forgot-password" component={ForgotPassword} />

          <Route path="/login">
            <Login
              loggedIn={loggedIn}
              login={login}
              cartCount={cartCount}
            />
          </Route>

          <Route path="/register" component={RegisterForm} />
          <Route path="/FAQ" component={FAQ} />
          <Route path="/about" component={About} />
          <Route path="/legal" component={Legal} />

          <Route path="/">
            <MastHead />
            <ProductGrid productsByCategories={productsByCategories} />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Context.Provider>
  );
};

export default withRouter(App);
