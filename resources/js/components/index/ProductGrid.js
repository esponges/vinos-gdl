import axios from "axios";
import React, { useState } from "react";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductGrid = (props) => {
    const categories = props.products;

    const addToCart = (id, event) => {
        event.preventDefault();
        // console.log(id, 'onclick');
        axios.get(`cart/${id}/add`)
        .then(res => {
            // console.log(res.data, 'added to cart!!!');
            window.alert(res.data);
        })
        .catch(() => {
            console.log('not added bro!!!');
        })
    }


    return (
        <>
            {/* {categories ? console.log(categories[0].id) : ''} */}
            {categories ? categories.map(category => {
                return (
                    <div
                        className="mt-2"
                        id={category.category_name}
                        key={category.id}
                    >
                        <section
                            className="container mb-2"
                            id={category.category_name}
                        >
                            <h1 className="mt-5">{category.category_name}</h1>
                            <div className="row mt-3">
                                {category.products.map((product) => {
                                    return (
                                        <div
                                            key={product.id}
                                            className="col-md-3 mt-3"
                                        >
                                            <Card style={{ width: "18rem" }}>
                                                <Card.Img
                                                    variant="top"
                                                    src="img/bottle.png"
                                                />
                                                <Card.Body>
                                                    <Card.Title>
                                                        <b>{product.name}</b>
                                                    </Card.Title>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>
                                                        Precio {product.price}
                                                    </ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <Card.Link
                                                                onClick={() => addToCart(
                                                                    product.id, event
                                                                )}
                                                            >
                                                                <Button variant="primary">
                                                                    Comprar
                                                                </Button>
                                                            </Card.Link>
                                                        </div>
                                                        <div className="col-6">
                                                            <Link
                                                                to={{
                                                                    pathname: `/products/${product.id}`,
                                                                    state: {
                                                                        name:
                                                                            product.name,
                                                                        description:
                                                                            product.description,
                                                                        price:
                                                                            product.price,
                                                                    },
                                                                }}
                                                            >
                                                                <Button variant="secondary">
                                                                    Detalles
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                );
            }) : ""}
        </>
    );
};

export default ProductGrid;
