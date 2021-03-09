import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Context } from "../Context";

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
                                                    <Card.Img
                                                        variant="top"
                                                        src={`/img/products/${product.id}.jpg`}
                                                    />
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {product.name}
                                                        </Card.Title>
                                                        <Card.Text>
                                                            <b>
                                                                $ {product.price}
                                                                mxn
                                                            </b>
                                                        </Card.Text>
                                                        <div className="row">
                                                                <div className="col-3 d-none d-sm-block">
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        name="quantity"
                                                                        defaultValue={
                                                                            1
                                                                        }
                                                                        className="form-control input-number"
                                                                        onChange={async (e) => await setItemCount(parseInt(e.target.value))}
                                                                        style={{minWidth: "60px" }}
                                                                    />
                                                                </div>
                                                                <div className="col-3">
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={(e) => handleItemAddClick(e, product.id)}
                                                                    >
                                                                        +
                                                                    </Button>
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
