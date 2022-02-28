/* eslint-disable prefer-rest-params */
import _ from 'lodash';
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* eslint-disable import/prefer-default-export */
export function debounce(func, wait, inmmediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!inmmediate) func.apply(context, args);
    };
    const callNow = inmmediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const getProductImage = (productId, styleProps) => (
  <Card.Img
    src={`/img/products/${productId}.jpg`}
    style={{
      ...styleProps,
    }}
    onError={(e) => { e.target.onerror = null; e.target.src = '/img/products/no-product.jpg'; }}
    alt={`Product Id ${productId}`}
  />
);

export const renderCurrency = (number, isMobile = false) => {
  let currencyNumber;
  if (!isMobile) {
    currencyNumber = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MXN',
    }).format(
      number,
    );
  } else {
    currencyNumber = `$${number}`;
  }

  return currencyNumber;
};

export const renderCategory = (id, categories) => {
  const categoryName = !_.isEmpty(categories) && categories[0].find((category) => category.id === id);
  return _.has(categoryName, 'category_name') ? categoryName.category_name : null;
};

export const nameLinkRenderer = ({ rowData: { name, id } }) => (<Link to={`/products/${id}`}>{name}</Link>);

export const listActionsRenderer = (id, price, handleAddItemToCart, isMobile = false) => (
  <Button onClick={() => handleAddItemToCart(id, price)} content="Añadir">{!isMobile ? 'comprar' : '+'}</Button>
);
