import axios from "axios";
import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductGrid = (props) => {
    const [itemCount, setItemCount] = useState(1);
    const categories = props.products;
    const [productAddMsg, setProductAddMsg] = useState(false);
    const [productAddId, setProductAddId] = useState("");

    const addToCart = (id, event) => {
        event.preventDefault();
        console.log(`item ${id}, cantidad ${itemCount}`);
        axios.get(`cart/${id}/add/${itemCount}`)
        .then(() => {
            // console.log(res.data, 'added to cart!!!');
            props.cartCountUpdate(itemCount);
            // window.alert(res.data);
            setProductAddMsg("Añadido");
            setProductAddId(id);
        })
        .catch((err) => {
            console.error(err);
        })
    }


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
                                                className="col-lg-3 col-md-4 col-sm-6 mt-3"
                                            >
                                                <Card>
                                                    <Card.Img
                                                        variant="top"
                                                        src={`/img/productGrid/${product.id}.jpg`}
                                                    />
                                                    <Card.Body>
                                                        <Card.Title>
                                                            <b>
                                                                {product.name}
                                                            </b>
                                                        </Card.Title>
                                                        <Card.Text>
                                                            $ {product.price}{" "}
                                                            mxn
                                                        </Card.Text>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <Card.Link>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <input
                                                                                type="number"
                                                                                name="quantity"
                                                                                defaultValue={
                                                                                    1
                                                                                }
                                                                                className="form-control input-number"
                                                                                onChange={async (
                                                                                    e
                                                                                ) =>
                                                                                    await setItemCount(
                                                                                        parseInt(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    minWidth:
                                                                                        "60px",
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <Button
                                                                                variant="primary"
                                                                                onClick={() =>
                                                                                    addToCart(
                                                                                        product.id,
                                                                                        event
                                                                                    )
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                +{" "}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Card.Link>
                                                            </div>
                                                            <div className="col-6">
                                                                <Link
                                                                    to={{
                                                                        pathname: `/products/${product.id}`,
                                                                    }}
                                                                >
                                                                    <Button variant="secondary">
                                                                        Detalles
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        {productAddMsg && product.id == productAddId &&
                                                            <div>
                                                                <p style={{ color: "red", marginTop: "10px" }}>
                                                                    {productAddMsg}
                                                                </p>
                                                                <Card.Text style={{ color: "red", marginTop: "10px" }}>
                                                                    {productAddMsg}
                                                                </Card.Text>
                                                            </div>
                                                        }
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
