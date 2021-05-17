import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);

const ProductCard = React.memo(({product, setItemCount, handleItemAddClick, itemCount}) => {

    return (
        <div
            key={product.id}
            className="col-lg-3 col-md-4 mt-3"
            id="product-card-mobile"
        >
            <Card>
                <Link
                    to={{
                        pathname: `/products/${product.id}`,
                    }}
                >
                    <Card.Img
                        variant="top"
                        src={`/img/products/${product.id}.jpg`}
                    />
                </Link>
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                        <b>
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "MXN",
                            }).format(product.price)}
                        </b>
                    </Card.Text>
                    {product.comp_price && (
                        <Card.Text id="grid-competitor-price">
                            Prom. competencia: ${product.comp_price}*
                        </Card.Text>
                    )}
                    <div className="btn-group">
                        <div className="d-none d-xl-block">
                            <input
                                type="number"
                                min="1"
                                name="quantity"
                                value={itemCount}
                                className="form-control input-number"
                                onChange={async (e) =>
                                    await setItemCount(parseInt(e.target.value))
                                }
                                style={{
                                    maxWidth: "70px",
                                }}
                            />
                        </div>
                        <Button
                            variant="primary"
                            id="main-add-btn"
                            data-testid={`main-add-btn-${product.id}`}
                            onClick={(e) =>
                                handleItemAddClick(e, product.id, product.price)
                            }
                        >
                            Añadir <FontAwesomeIcon icon={faShoppingBag} />
                        </Button>
                        <Link
                            to={{
                                pathname: `/products/${product.id}`,
                            }}
                            id="main-details-btn"
                        >
                            <Button variant="secondary">Info</Button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
});
export default ProductCard;
