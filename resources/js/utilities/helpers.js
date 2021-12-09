/* eslint-disable prefer-rest-params */
import _ from 'lodash';
import React from 'react';
import { Card } from 'react-bootstrap';

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

export const getProductImage = (productId) => (
  <Card.Img
    src={`/img/products/${productId}.jpg`}
    style={{
      width: '85px',
      height: '85px',
    }}
    onError={(e) => { e.target.onerror = null; e.target.src = '/img/products/no-product.jpg'; }}
    alt={`Product Id ${productId}`}
  />
);

export const renderCurrency = (number) => {
  const currencyNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
  }).format(
    number,
  );
  return currencyNumber;
};

export const renderCategory = (id, categories) => {
  const categoryName = !_.isEmpty(categories) && categories[0].find((category) => category.id === id);
  return _.has(categoryName, 'category_name') ? categoryName.category_name : null;
};
