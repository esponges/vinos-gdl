/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { Button, Table, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '../CustomLoader';

import { Context } from '../Context';
import { fetchCartItems } from '../../store/cart/reducers';
import { getProductImage } from '../../utilities/helpers';

const Cart = ({ cartCountUpdate }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  // eslint-disable-next-line max-len
  const cartTotal = cartItems.length > 0 ? cartItems.map(({ quantity, price }) => (quantity * price)).reduce((a, b) => a + b, 0) : null;

  const context = useContext(Context);

  const addOneMore = async (id, i, price) => {
    context.setLoader(true);

    try {
      const res = await axios.get(`cart/${id}/add/1`);
      // if res true
      if (res) {
        cartCountUpdate(1);
        context.notifyMinAmountRemaining(price);

        await dispatch(fetchCartItems());
      } else {
        console.error('error fecthing add route');
        context.setLoader(false);
      }
    } catch (err) {
      console.error(err);
      context.setLoader(false);
    } finally {
      context.setLoader(false);
    }
  };

  // remove all items from given id
  const removeItem = async (productToRemove, productId, qty) => {
    try {
      // context.setLoader(true);
      const res = await axios.get(`/cart/${productId}/destroy`);
      // positive response
      if (res) {
        dispatch(fetchCartItems());

        const removedAmount = productToRemove.price * qty;
        // remove all item count from navbar counter
        cartCountUpdate(qty * -1);
        context.notifyMinAmountRemaining(removedAmount * -1);
      } else {
        console.error('error fetching delete route');
        context.setLoader(false);
      }
      // res not true
    } catch (err) {
      console.error(err, 'try failed, got catch');
      context.setLoader(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCartItems());
  }, []);

  return (
    <div>
      <h1>Tu vinos seleccionados</h1>
      {cartItems.length === 0 ? (
        <Alert variant="info">
          Aún no has añadido productos al carrito
        </Alert>
      ) : !context.loader ? (
        <Table striped bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Sub-Total</th>
            </tr>
          </thead>
          {cartItems.length > 0 && cartItems.map((product, i) => (
            /* in this case using index instead id is required for cart update */
            <tbody key={product.name}>
              <tr>
                <td>
                  <h5>{product.name}</h5>
                  <br />
                  {getProductImage(product.id)}
                </td>
                <td>
                  <div
                    className="btn-group"
                    id="qty-action-btns"
                  >
                    <Button
                      variant="success"
                      id="cart-qty-btn"
                    >
                      {product.quantity}
                    </Button>
                    <Button
                      data-testid={`add-one-more-btn-${i}`}
                      variant="link"
                      id="add-one-more-cart"
                      onClick={() => addOneMore(product.id, i, product.price)}
                    >
                      <b>¡Añade una más!</b>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => removeItem(
                        product,
                        product.id,
                        product.quantity,
                      )}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
                <td data-testid="sub-total">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(
                    product.quantity * product.price,
                  )}
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      ) : (
        <CustomLoader />
      )}
      <div className="container mt-3">
        <h3 className="mb-3">
          Total
          {' '}
          <b>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'MXN',
            }).format(cartTotal)}
          </b>
        </h3>
        {cartTotal && (cartTotal < 1500) && (
        <Alert variant="warning">
          Te faltan
          {' '}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'MXN',
          }).format(1500 - cartTotal)}
          {' '}
          para completar tu pedido
        </Alert>
        )}
        {cartTotal === 0 ? (
          <Link to="/">
            <Button> Regresar </Button>
          </Link>
        ) : (
          <div className="row">
            <div className="col-4">
              {/* check if client can pay */}
              <Link to="/cart/checkout">
                <Button
                  variant="outline-success"
                  size="lg"
                  disabled={cartTotal < 1500}
                >
                  Pagar
                </Button>
              </Link>
            </div>
            <div className="col-4">
              <Link to="/">
                <Button variant="outline-secondary">
                  Regresar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
