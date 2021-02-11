import React, { useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

const SingleProduct = (props) => {
    const [itemCount, setItemCount] = useState(1);
    // const product = props.location.state;
    const [product, setProduct] = useState({})
    const [competidorsInfo, setCompetidorsInfo] = useState([]);

    const addToCart = (id, event) => {
        event.preventDefault();
        console.log(`item ${id}, cantidad ${itemCount}`);
        axios
            .get(`cart/${id}/add/${itemCount}`)
            .then((res) => {
                props.cartCountUpdate(parseInt(itemCount));
                window.alert(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // get product info
        console.log('useEffect from SingleProduct.js');
        axios
        .get(`/products/${props.match.params.id}`)
        .then(res => {
            setProduct(res.data);
        })
        .catch((err) => {
            console.error(err);
        });
        // get competidors info (links & price)
        axios
        .get(`/products/${props.match.params.id}/links`)
        .then(res => {
            setCompetidorsInfo( res.data );
        })
        .catch(err => {
            console.error( err );
        });
    }, []);

    return (
        <div
            className="container"
            style={{ width: "32rem", marginTop: "5%", marginBottom: "10%" }}
        >
            {console.log("SingleProduct.js rendering")}

            {product != {} && (
                <Card>
                    <Card.Img
                        variant="top"
                        src={product.id && `/img/${product.id}.jpg`}
                    />
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Precio: $ {product.price}</ListGroupItem>
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
                                                    <span>&nbsp;&nbsp;</span>$
                                                    {competidorsInfo[0].price}
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
                                                    <span>&nbsp;&nbsp;</span>$
                                                    {competidorsInfo[1].price}
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
                                    defaultValue={1}
                                    className="form-control input-number"
                                    onChange={async (e) => await setItemCount(e.target.value)}
                                    style={{ minWidth: "60px" }}
                                />
                            </div>
                            <div className="col-6">
                                <Button
                                    variant="primary"
                                    onClick={() => addToCart(product.id, event)}
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
