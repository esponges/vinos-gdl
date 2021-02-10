import axios from "axios";
import React, { useState } from "react";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductGrid = (props) => {
    const [itemCount, setItemCount] = useState(1);
    const categories = props.products;

    const addToCart = (id, event) => {
        event.preventDefault();
        console.log(`item ${id}, cantidad ${itemCount}`);
        axios.get(`cart/${id}/add/${itemCount}`)
        .then(res => {
            // console.log(res.data, 'added to cart!!!');
            props.cartCountUpdate(itemCount);
            window.alert(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
    }


    return (
        <>
            {console.log('rendering ProductGrid.js')}
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
                                        <div key={product.id} className="col-lg-4 mt-3">
                                            <Card style={{ width: "18rem" }}>
                                                <Card.Img variant="top" src={`/img/${product.id}.jpg`}/>
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
                                                        <div className="row">
                                                            <div className="col-md-6"></div>
                                                        </div>
                                                        <div className="col-6">
                                                            <Card.Link>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="number"
                                                                            name="quantity"
                                                                            defaultValue={1}
                                                                            className="form-control input-number"
                                                                            onChange={async (e) => await setItemCount(parseInt(e.target.value))}
                                                                            style={{ minWidth:"60px" }}
                                                                        />
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <Button
                                                                            variant="primary"
                                                                            onClick={() =>
                                                                                addToCart( product.id, event )}
                                                                        > + </Button>
                                                                    </div>
                                                                </div>
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
                            <div className="container mt-5">
                                <Link className="ml-5 mt-3" to={`/categories/${category.category_name}`}>
                                    <Button variant="outline-primary" size="lg">Ver todos los disponibles</Button>
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
