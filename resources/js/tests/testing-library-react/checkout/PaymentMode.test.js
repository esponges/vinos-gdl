import React from 'react';
import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import PaymentMode from '../../../components/checkout/PaymentMode';

const upfrontPayPalPayment = 1000;

describe('PaymentMode Component', () => {
    it('renders', () => {
        render(
            <HashRouter>
                <PaymentMode upfrontPayPalPayment={upfrontPayPalPayment}/>
            </HashRouter>
        );
    });
})
