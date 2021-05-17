import React, { useContext, useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Context } from "../Context";
import axios from "axios";

import { Card, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import CustomLoader from "../CustomLoader";

const SingleProduct = (props) => {
    const [itemCount, setItemCount] = useState(1);
    // const product = props.location.state;
    const [product, setProduct] = useState({});
    const [competidorsInfo, setCompetidorsInfo] = useState([]);

    const [productAddId, setProductAddId] = useState("");

    const context = useContext(Context);

    const handleItemAddClick = (e, id, price) => {
        e.preventDefault();
        setProductAddId(id);

        context.addToCart(id, itemCount);
        context.getCartContent();

        let productSubTotal = price * itemCount;
        context.notifyMinAmountRemaining(productSubTotal);
    };

    useEffect(() => {
        let isMounted = true; // avoid unmounted item warning

        // get product info
        console.log("useEffect from SingleProduct.js");
        axios
            .get(`/products/${props.match.params.id}`)
            .then((res) => {
                if (isMounted) setProduct(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
        // get competidors info (links & price)
        axios
            .get(`/products/${props.match.params.id}/links`)
            .then((res) => {
                if (isMounted) setCompetidorsInfo(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            isMounted = false;
        };
    }, [props.match.params.id]);

    return (
        <div
            className="container"
            style={{ maxWidth: "32rem", marginTop: "5%", marginBottom: "10%" }}
        >
            {product != {} && !context.loader ? (
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
                        style={{ fontSize: "1.2rem" }}
                    >
                        <ListGroupItem>
                            <b>
                                Precio: &nbsp;
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "MXN",
                                }).format(product.price)}
                            </b>
                        </ListGroupItem>
                        {product.comp_price && (
                            <Card.Text id="single-competitor-price">
                                Prom. competencia: ${product.comp_price}*
                            </Card.Text>
                        )}
                    </ListGroup>
                    <Card.Body>
                        <div className="row">
                            <div className="col-6">
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={itemCount}
                                    className="form-control input-number"
                                    onChange={async (e) =>
                                        await setItemCount(
                                            parseInt(e.target.value)
                                        )
                                    }
                                    style={{ minWidth: "60px" }}
                                />
                            </div>
                            <div className="col-6">
                                <Button
                                    variant="primary"
                                    onClick={(e) =>
                                        handleItemAddClick(
                                            e,
                                            product.id,
                                            product.price
                                        )
                                    }
                                >
                                    +
                                </Button>
                                <p>
                                    <i>Añadir al carrito</i>
                                </p>
                            </div>
                        </div>
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
