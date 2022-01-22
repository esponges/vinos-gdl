/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const CartItemsList = function () {
  const cartItems = useSelector((state) => state.cart.items);
  const [areItemsListVisible, setAreItemsListVisible] = useState(false);

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setAreItemsListVisible(!areItemsListVisible)}>Revisa tus productos</Button>
      <Table responsive="sm" style={{ display: areItemsListVisible ? 'block' : 'none' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ name, price, quantity }, i) => (
            <tr key={name}>
              <td>{(i + 1)}</td>
              <td>{name}</td>
              <td>{price}</td>
              <td>{quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CartItemsList;
