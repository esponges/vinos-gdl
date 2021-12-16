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

const SingleProduct = ({ match }) => {
  const [itemCount, setItemCount] = useState(1);
  const [product, setProduct] = useState({});
  const context = useContext(Context);
  const handleAddItemToCart = useAddItemToCart();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // avoid unmounted item warning

    // get product info
    axios
      .get(`/products/${match.params.id}`)
      .then((res) => {
        if (isMounted) setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    console.log('get product');
    dispatch(getProduct(match.params.id));
    // get competidors info (links & price)

    return () => {
      isMounted = false;
    };
  }, [match.params.id]);

  return (
    <div
      className="container"
      style={{ maxWidth: '32rem', marginTop: '5%', marginBottom: '10%' }}
    >
      {!_.isEmpty(product) && !context.loader ? (
        <Card>
          <Card.Img
            variant="top"
            src={product.id && `/img/products/${product.id}.jpg`}
          />
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            {/* <Card.Text>{product.description}</Card.Text> */}
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
            {product.comp_price && (
            <Card.Text id="single-competitor-price">
              Prom. competencia: $
              {product.comp_price}
              *
            </Card.Text>
            )}
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
                    onClick={() => handleAddItemToCart(
                      product.id,
                      product.price,
                      itemCount,
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
