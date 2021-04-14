import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";

import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);

import CustomLoader from "../CustomLoader";

const BestSellers = ({ products, ...props }) => {
    const context = useContext(Context);
    const bestSellers = context.allProducts;

    return (
        <div>
            {!context.loader && bestSellers.length > 0 ? (
            /* somehow I was getting empty object for bestSellers which was crashing app */
                <section className="container mb-2" id="best_sellers">
                    <h1
                        className="mt-5 center"
                        style={{
                            textAlign: "center",
                            fontSize: "3rem",
                        }}
                    >
                        <span className="badge badge-secondary">
                            Best Sellers
                        </span>
                    </h1>
                    <div className="row mt-3">
                        {console.log('im gonna map now', 'best sellers btw is ', bestSellers)}
                        {bestSellers.map((product) => {
                            if (product.best_seller === 1) {
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
                                                <Card.Title>
                                                    {product.name}
                                                </Card.Title>
                                                <Card.Text>
                                                    <b>
                                                        {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                style: "currency",
                                                                currency: "MXN",
                                                            }
                                                        ).format(product.price)}
                                                    </b>
                                                </Card.Text>
                                                <div className="btn-group">
                                                    <div className="d-none d-lg-block">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            name="quantity"
                                                            value={props.itemCount}
                                                            className="form-control input-number"
                                                            onChange={async (e) =>
                                                                await props.setItemCount(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            style={{
                                                                maxWidth: "70px",
                                                            }}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        id="main-add-btn"
                                                        onClick={(e) =>
                                                            props.handleItemAddClick(
                                                                e,
                                                                product.id,
                                                                product.price
                                                            )
                                                        }
                                                    >
                                                        Añadir{" "}
                                                        <FontAwesomeIcon
                                                            icon={faShoppingBag}
                                                        />
                                                    </Button>
                                                    <Link
                                                        to={{
                                                            pathname: `/products/${product.id}`,
                                                        }}
                                                        id="main-details-btn"
                                                    >
                                                        <Button variant="secondary">
                                                            Info
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    {/* <div className="container mt-5">
                        <Link
                            className="mt-3"
                            to={`/categories/${category.category_name}`}
                        >
                            <Button variant="outline-primary" size="lg">
                                ¿Quieres más? ¡Checa todo el surtido de{" "}
                                {category.category_name}!
                            </Button>
                        </Link>
                    </div> */}
                </section>
            ) : (
                bestSellers.length > 0 ? <CustomLoader /> : ""
            )}
        </div>
    );
};

export default BestSellers;
