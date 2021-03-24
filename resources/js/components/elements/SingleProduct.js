import React, { useContext, useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { Context } from '../Context';
import axios from 'axios';

const SingleProduct = (props) => {
    const [itemCount, setItemCount] = useState(1);
    // const product = props.location.state;
    const [product, setProduct] = useState({})
    const [competidorsInfo, setCompetidorsInfo] = useState([]);

    const [productAddMsg, setProductAddMsg] = useState(false);
    const [productAddId, setProductAddId] = useState("");

    const context = useContext(Context);

    const handleItemAddClick = (e, id, price) => {
        e.preventDefault();
        setProductAddMsg("Añadido al carrito");
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
            {product != {} && (
                <Card>
                    <Card.Img
                        variant="top"
                        src={product.id && `/img/products/${product.id}.jpg`}
                    />
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        {/* <Card.Text>{product.description}</Card.Text> */}
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Precio:
                            {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "MXN",
                                }).format(product.price)}
                        </ListGroupItem>
                        <ListGroupItem>
                            {competidorsInfo.length != 0 && (
                                <div>
                                    <b>Compara la competencia</b>
                                    <ul>
                                        {competidorsInfo[0] && (
                                            <li>
                                                <button
                                                    className="btn btn-secondary-sm"
                                                    target="_blank"
                                                    onClick={(e) => {
                                                        e.preventDefault;
                                                        window.open(competidorsInfo[0].link);
                                                    }}
                                                >
                                                    <img
                                                        src="/img/superama.png"
                                                        alt="superama"
                                                        style={{
                                                            width: "75px",
                                                            height: "35px",
                                                        }}
                                                    />
                                                    <span>&nbsp;&nbsp;</span>
                                                    {new Intl.NumberFormat("en-US", {
                                                            style: "currency",
                                                            currency: "MXN",
                                                        }).format(competidorsInfo[0].price)}
                                                </button>
                                            </li>
                                        )}
                                        {competidorsInfo[1] && (
                                            <li>
                                                <button
                                                    className="btn btn-secondary-sm"
                                                    target="_blank"
                                                    onClick={(e) => {
                                                        e.preventDefault;
                                                        window.open(competidorsInfo[1].link);
                                                    }}
                                                >
                                                    <img
                                                        src="/img/consuvino.png"
                                                        alt="consuvino"
                                                        style={{
                                                            width: "75px",
                                                            height: "25px",
                                                        }}
                                                    />
                                                    <span>&nbsp;&nbsp;</span>
                                                    {new Intl.NumberFormat("en-US", {
                                                            style: "currency",
                                                            currency: "MXN",
                                                        }).format(competidorsInfo[1].price)}
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        <div className="row">
                            <div className="col-6">
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    defaultValue={1}
                                    className="form-control input-number"
                                    onChange={async (e) => await setItemCount(parseInt(e.target.value))}
                                    style={{ minWidth: "60px" }}
                                />
                            </div>
                            <div className="col-6">
                                <Button
                                    variant="primary"
                                    onClick={(e) => handleItemAddClick(e, product.id, product.price)}
                                >
                                    +
                                </Button>
                                <p>
                                    <i>Añadir al carrito</i>
                                </p>
                            </div>
                        </div>
                        {productAddMsg &&
                            product.id ==
                                productAddId && (
                                <div>
                                    <Card.Text
                                        style={{color: "red", marginTop: "10px"}}
                                    > { productAddMsg }
                                    </Card.Text>
                                </div>
                            )}
                    </Card.Body>
                </Card>
            )}
            <div className="container mt-5">
                <Link className="ml-2" to="/">
                    <Button variant="outline-primary" size="lg">
                        Regresar al inicio
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default withRouter(SingleProduct); // HOC to access match, location and history
