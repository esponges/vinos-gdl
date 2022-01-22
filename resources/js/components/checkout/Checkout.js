/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
import axios from 'axios';
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import { Link, withRouter } from 'react-router-dom';

import {
  Form, Button, Alert, Overlay, Tooltip,
} from 'react-bootstrap';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Context } from '../Context';

import LoginOrRegister from '../auth/LoginOrRegister';
import CheckCP from './CheckCP';
import PaymentMode from './PaymentMode';
import DeliverySchedule from './DeliverySchedule';
import CustomLoader from '../CustomLoader';
import CartItemsList from './CartItemsList';

library.add(fab);

const Checkout = function ({ userInfo, ...props }) {
  const [order, setOrder] = useState({
    phone: userInfo?.userPhone ?? '',
    orderName: userInfo?.userName,
    CP: userInfo?.CP ?? '',
    neighborhood: userInfo?.neighborhood ?? '',
    streetName: '',
    addressNumber: '',
    paymentMode: 'transfer',
    addressDetails: '',
    deliveryDay: userInfo?.deliveryDay ?? '',
    deliverySchedule: userInfo?.deliverySchedule ?? '',
    cartTotal: '',
    upfrontPayPalPayment: '',
  });

  const {
    phone,
    orderName,
    CP,
    neighborhood,
    streetName,
    addressNumber,
    paymentMode,
    addressDetails,
    deliveryDay,
    deliverySchedule,
    cartTotal,
    upfrontPayPalPayment,
  } = order;

  const [buttonIsActive, setButtonIsActive] = useState(false);
  const [phoneAlertMessage, setPhoneAlertMessage] = useState(null);
  const [addressAlertMessage, setAddressAlertMessage] = useState(null);
  const [paymentModeReminder, setPaymentModeReminder] = useState('transfer'); // while fixing paypal

  const [show, setShow] = useState(false); // for Overlay Bootstrap element
  const target = useRef(null); // for Overlay Bootstrap element

  const [loader, setLoader] = useState(false);

  const context = useContext(Context);

  // from payment type radio input
  const handlePaymentChange = (e) => {
    setOrder({ ...order, paymentMode: e.target.value });
  };

  const handleTransferSubmit = () => {
    context.notifyToaster('info', 'Generando orden');

    setLoader(true);

    axios
      .post('/order/rest-api/create', {
        order_name: orderName ?? userInfo?.userName,
        payment_mode: paymentMode,
        address: `${streetName} #${addressNumber}`,
        address_details: addressDetails,
        phone,
        cp: CP,
        delivery_day: deliveryDay,
        delivery_schedule: deliverySchedule,
        neighborhood,
        balance: 0,
      })
      .then((res) => {
        const { data: { orderID, paymentType } } = res;

        axios.post('/order/success/admin-email', {
          orderID,
        });
        context.notifyToaster('success', 'Orden creada exitosamente');
        context.setCartCount(0);

        setTimeout(() => {
          // setLoader(false);
          props.history.push(`/checkout/success/${orderID}/${paymentType}`);
        }, 4000);
      })
      .catch((err) => {
        console.error(err);
        context.notifyToaster(
          'warn',
          'Tuvimos problemas creando tu orden :(',
        );
        setLoader(false);
      });
  };

  // validate CP
  const getCpInfo = (cpData) => {
    setOrder({ ...order, CP: cpData.cp, neighborhood: cpData.name });
  };

  const getDeliveryInfo = (day, schedule) => {
    setOrder({ ...order, deliveryDay: day, deliverySchedule: schedule });
  };

  // get user info and cart total-subtotal
  useEffect(() => {
    axios
      .get('/cart/get-total')
      .then((res) => {
        axios
          .get('/cart/get-subtotal')
          .then((response) => {
            setOrder({
              ...order,
              cartTotal: res.data,
              upfrontPayPalPayment: response.data,
            }); // 7% comission
          })
          .catch((err) => {
            console.error(err);
            context.notifyToaster(
              'error',
              'Tenemos problemas con el servidor. Intenta más tarde',
            );
          });
      })
      .catch((err) => {
        console.error(err);
        context.notifyToaster(
          'error',
          'Tenemos problemas con el servidor. Intenta más tarde',
        );
      });
  }, []);

  // validations
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      // validate phone
      const phonePattern = (/^[0-9\b]+$/);
      if (phone) {
        if (phonePattern.test(phone)) {
          if (phone.length === 10) {
            setPhoneAlertMessage(false);
          } else {
            setPhoneAlertMessage(
              'Por favor ingresa número de 10 dígitos',
            );
          }
        } else {
          setPhoneAlertMessage('Por favor sólo ingresa números');
        }
      }
      // validate address
      if (
        streetName.length > 3
                && streetName.length < 6
                && !addressNumber
      ) {
        setAddressAlertMessage('Por favor ingresa dirección completa');
      } else if (streetName.length > 5 && !addressNumber) {
        setAddressAlertMessage('Por favor ingresa dirección completa');
      } else {
        setAddressAlertMessage(false);
      }

      // activate proceed button - must check due to async
      // states won't be updated until rerender
      // don't bother trying to await setState

      if (
        streetName.length >= 5
                && addressNumber.length > 0
                && phonePattern.test(phone)
                && phone.length === 10
                && order.orderName
                && CP
                && deliveryDay
                && deliverySchedule
      ) {
        setButtonIsActive(true);
      } else setButtonIsActive(false);
      // remind user payment method
      paymentMode === 'on_delivery'
                && setPaymentModeReminder('Anticipo con PayPal');
      paymentMode === 'transfer'
                && setPaymentModeReminder(
                  'Pago del 100% por transferencia o depósito',
                );
      paymentMode === 'paypal'
                && setPaymentModeReminder('Pago del 100% por PayPal');
    }

    return () => (isMounted = false);
  }, [order]);

  const totalHeader = <h3>{`Total MX${cartTotal}`}</h3>;

  return (
    <div className="container">
      {!loader ? (
        props.loggedIn && cartTotal > 1500 ? (
          <div style={{ marginBottom: '6rem' }}>
            {/* prompt user for payment method */}

            <div data-testid="top-total-header">
              {totalHeader && totalHeader}
            </div>

            <CartItemsList />

            <PaymentMode
              handlePaymentChange={handlePaymentChange}
              upfrontPayPalPayment={upfrontPayPalPayment}
            />


            {/* if user choses on_delivery */}
            {paymentMode === 'on_delivery' && (
            <Alert variant="warning">
              Si eliges liquidar el saldo propsante al recibir
              recuerda que nuestro repartidor
              {' '}
              <u>sólo acepta efectivo</u>
              .
            </Alert>
            )}

            {paymentMode === 'full_MP' && (
            <Alert variant="secondary">
              Nos pondremos en contacto contigo para enviarte un link seguro de pago a través de MercadoPago una vez confirmada tu orden.
            </Alert>
            )}

            <Form>
              <Form.Group>
                <Form.Label>Tu nombre</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={userInfo?.userName}
                  onChange={(e) => setOrder({
                    ...order,
                    orderName: e.target.value,
                  })}
                  name="order_name"
                />
                {!order.orderName
                                    && (
                                    <Alert variant="warning" className="m-1 mt-2">
                                      Por favor ingresa tu nombre
                                    </Alert>
                                    )}

                <Form.Label className="mt-2">Email</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  value={`${userInfo?.userEmail}`}
                />
                <Form.Text className="text-muted success">
                  A este correo te enviaremos la confirmación
                </Form.Text>

                <Form.Label className="mt-2">
                  Tu teléfono
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu teléfono"
                  value={phone}
                  name="phone"
                  aria-label="phone-input"
                  onChange={(e) => setOrder({
                    ...order,
                    phone: e.target.value,
                  })}
                />
                <Form.Text className="text-muted success">
                  Sólo lo usaremos para mantenerte informado
                  sobre tu orden
                </Form.Text>
                {phoneAlertMessage && (
                <Alert variant="warning" className="m-1">
                  {phoneAlertMessage}
                </Alert>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Tu Código Postal</Form.Label>
                <CheckCP getCpInfo={getCpInfo} order={order} />
                {/* Pop Over */}
                <Button
                  variant="link"
                  ref={target}
                  onClick={() => setShow(!show)}
                >
                  ¿No encuentras tu código postal?
                </Button>
                <Overlay
                  target={target.current}
                  show={show}
                  placement="top"
                >
                  {(prps) => (
                    <Tooltip id="overlay-cp" {...prps}>
                      Significa que aún no llegamos a tu
                      ubicación :(
                    </Tooltip>
                  )}
                </Overlay>
              </Form.Group>

              {/* address */}
              <Form.Group className="mt-2">
                <Form.Label>Calle o avenida</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="La dirección de tu casa"
                  value={streetName}
                  data-testid="streetName-input"
                  aria-label="streetName-input"
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      streetName: e.target.value,
                    });
                  }}
                />
                <Form.Label className="mt-2">
                  Número exterior
                  {' '}
                  <i>(e interior si tienes)</i>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="El número de la dirección"
                  value={addressNumber}
                  aria-label="addressNumber-input"
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      addressNumber: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              {addressAlertMessage && (
                <Alert variant="warning" className="m-1">
                  {addressAlertMessage}
                </Alert>
              )}

              <DeliverySchedule
                getDeliveryInfo={getDeliveryInfo}
              />

              {/* more address info */}
              <Form.Group className="mt-2">
                <Form.Label>
                  Opcional - Condominio, faccionamiento, o
                  edificio
                  {' '}
                  <i>(detalles)</i>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Para dar más fácilmente contigo"
                  name="address_details"
                  value={addressDetails}
                  aria-label="addressDetails-input"
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      addressDetails: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              {!buttonIsActive
                                && (addressAlertMessage || phone.length !== 10) && (
                                <Alert variant="warning" className="m-1">
                                  Por favor completa tu información
                                </Alert>
              )}
              {totalHeader && totalHeader}
              <p>
                Tipo de pago:
                {' '}
                <b>{paymentModeReminder}</b>
              </p>
              <Button
                className="mb-5"
                variant="primary"
                                // type="submit"
                disabled={!buttonIsActive}
                onClick={handleTransferSubmit}
              >
                Generar orden
              </Button>
            </Form>
            {/* <PaypalPayment /> */}
          </div>
        ) : (
          <div>
            {/* if user is not logged in he can't see the form */}
            {!props.loggedIn && <LoginOrRegister />}

            {cartTotal < 1500 && (
            <Alert variant="warning">
              No has completado tu compra mínima de MX$1,5000
            </Alert>
            )}
            <Link to="/">
              <Button variant="primary">Regresar</Button>
            </Link>
          </div>
        )
      ) : (
        <CustomLoader />
      )}
    </div>
  );
};

export default withRouter(Checkout);
