/* eslint-disable prefer-rest-params */
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
