import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Context } from "../Context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);

const ProductGrid = (props) => {
    const [itemCount, setItemCount] = useState(1);

    const categories = props.products;

    const [productAddMsg, setProductAddMsg] = useState(false);
    const [productAddId, setProductAddId] = useState("");

    const context = useContext(Context);

    const handleItemAddClick = (e, id) => {
        e.preventDefault();
        setProductAddMsg("Añadido al carrito");
        setProductAddId(id);
        context.addToCart(id, itemCount);
        context.getCartContent();
    };

    return (
        <>
            {categories ? categories.map(category => {
                return (
                    <div
                        className="mt-2"
                        id={category.category_name}
                        key={category.id}
                    >
                        {/* {console.log("rendering ProductGrid.js  ", categories)} */}

                        <section
                            className="container mb-2"
                            id={category.category_name}
                        >
                            <h1
                                className="mt-5 center"
                                style={{
                                    textAlign: "center",
                                    fontSize: "3rem",
                                }}
                            >
                                <span className="badge badge-secondary">
                                    {category.category_name}
                                </span>
                            </h1>
                            <div className="row mt-3">
                                {category.products.map((product) => {
                                    if (product.featured) {
                                        // filter only featured products
                                        return (
                                            <div
                                                key={product.id}
                                                className="col-lg-3 col-md-4 mt-3"
                                                id="product-card-mobile"
                                            >
                                                <Card>
                                                    <Link to={{pathname: `/products/${product.id}`}}>
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
                                                                {new Intl.NumberFormat("en-US", {
                                                                        style: "currency",
                                                                        currency: "MXN",
                                                                    }).format(product.price)}
                                                            </b>
                                                        </Card.Text>
                                                        <div className="btn-group">
                                                            <div className="d-none d-lg-block">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    name="quantity"
                                                                    defaultValue={1}
                                                                    className="form-control input-number"
                                                                    onChange={async (e) => await setItemCount(parseInt(e.target.value))}
                                                                    style={{maxWidth: "70px" }}
                                                                />
                                                            </div>
                                                            <Button
                                                                variant="primary"
                                                                id="main-add-btn"
                                                                onClick={(e) => handleItemAddClick(e, product.id)}
                                                            >
                                                                Añadir {" "}
                                                                <FontAwesomeIcon icon={faShoppingBag} />
                                                            </Button>
                                                            <Link
                                                                to={{pathname: `/products/${product.id}`}}
                                                                id="main-details-btn"
                                                            >
                                                                <Button variant="secondary">
                                                                    Info
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                        {productAddMsg &&
                                                            product.id ==
                                                                productAddId && (
                                                                <div>
                                                                    <Card.Text
                                                                        style={{
                                                                            color:
                                                                                "red",
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    > { productAddMsg }
                                                                    </Card.Text>
                                                                </div>
                                                            )}
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            <div className="container mt-5">
                                <Link
                                    className="mt-3"
                                    to={`/categories/${category.category_name}`}
                                >
                                    <Button variant="outline-primary" size="lg">
                                        ¿Quieres más? ¡Checa todo el surtido de{" "}
                                        {category.category_name}!
                                    </Button>
                                </Link>
                            </div>
                        </section>
                    </div>
                );
            }) : ""}
        </>
    );
};

export default ProductGrid;
