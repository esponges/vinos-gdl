import React from 'react';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Alert } from 'react-bootstrap';

library.add(fab);

const PaymentMode = function ({ handlePaymentChange }) {
  return (
    <div className="payment-mode">
      <Alert variant="success">
        ¿Cómo deseas pagar?
        <div className="container">
          <ul style={{ listStyle: 'none' }}>
            <li className="mt-2 mb-2">
              <input
                type="radio"
                value="transfer"
                name="payment_mode"
                onClick={handlePaymentChange}
                defaultChecked
              />
              El total (100%) con
              {' '}
              <b>Transferencia o depósito</b>
              {' '}
              bancario. Te enviaremos una vez confirmado tu pago.
            </li>
            <li className="mt-2 mb-2">
              <input
                type="radio"
                value="full_MP"
                name="payment_mode"
                onClick={handlePaymentChange}
              />
              El total (100%) con
              {' '}
              <b>MercadoPago.</b>
              {' '}
&nbsp;
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-6" />
          <div className="col-6" />
        </div>
      </Alert>
    </div>
  );
};

export default PaymentMode;
