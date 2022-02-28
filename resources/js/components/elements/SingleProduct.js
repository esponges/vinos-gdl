import React, { useContext, useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import {
  Card, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';
import { Context } from '../Context';
import CustomLoader from '../CustomLoader';
import { useAddItemToCart } from '../controls/hooks';
import { getProduct } from '../../store/products';
import { getProductImage } from '../../utilities/helpers';

const SingleProduct = ({ match }) => {
  const [itemCount, setItemCount] = useState(1);
  const [product, setProduct] = useState({});
  const context = useContext(Context);
  const handleAddItemToCart = useAddItemToCart();
  const dispatch = useDispatch();

  useEffect(() => {
    const dispatchGetProduct = async (product) => {
      const res = await dispatch(getProduct(match.params.id));
      setProduct(res);
    }
    dispatchGetProduct();
  }, [match.params.id]);

  const addItemToCart = (id, price) => {
    handleAddItemToCart(id, price, itemCount);
    setItemCount(1);
  }

  return (
    <div
      className="container"
      style={{ maxWidth: '32rem', marginTop: '5%', marginBottom: '10%' }}
    >
      {!_.isEmpty(product) && !context.loader ? (
        <Card>
          <div>
            {getProductImage(product.id, { minWidth: '35%' })}
          </div>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
          </Card.Body>
          <ListGroup
            className="list-group-flush"
            style={{ fontSize: '1.2rem' }}
          >
            <ListGroupItem>
              <b>
                Precio: &nbsp;
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'MXN',
                }).format(product.price)}
              </b>
            </ListGroupItem>
          </ListGroup>
          <Card.Body>
            {product.is_available ? (
              <div className="row">
                <div className="col-6">
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={itemCount}
                    className="form-control input-number"
                    onChange={(e) => setItemCount(
                      parseInt(e.target.value, 10),
                    )}
                  />
                </div>
                <div className="col-6">
                  <Button
                    variant="primary"
                    onClick={() => addItemToCart(
                      product.id,
                      product.price,
                    )}
                  >
                    +
                  </Button>
                  <span>Añadir al carrito</span>
                </div>
              </div>
            ) : (
              <div>Producto por el momento agotado</div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <CustomLoader />
      )}
      <div className="container mt-5">
        <Link className="ml-2" to="/">
          <Button variant="outline-primary" size="lg">
            Regresar
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default withRouter(SingleProduct);
