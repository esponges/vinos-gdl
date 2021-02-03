import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, ListGroupItem } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

const Category = (props) => {
    const [products, setProducts] = useState({});

    // useEffect (() => {
    //     axios
    //     .get(`/categories/${props.match.params.name}`)
    //     .then( res => {
    //         setProducts ( res.data );
    //     })
    //     .catch( err => {
    //         console.error(err);
    //     })
    // }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(
                    `/categories/${props.match.params.name}`
                );
                if (res) {
                    setProducts(res.data);
                } else {
                    console.log("route not working");
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    return (
        <section className="container mb-2">
            {console.log(products, props.match.params.name)}
            <h1 className="mt-5">{props.match.params.name}</h1>
            {products != {} ? (
                <div className="row mt-3">
                    {Object.values(products).map((product) => {
                        return (
                            <div key={product.id} className="col-lg-4 mt-3">
                                <Card style={{ width: "18rem" }}>
                                    <Card.Img
                                        variant="top"
                                        src={`/img/${product.id}.jpg`}
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
                                                                // onChange={async (
                                                                //     e
                                                                // ) =>
                                                                //     await setItemCount(
                                                                //         parseInt(
                                                                //             e.target
                                                                //                 .value
                                                                //         )
                                                                //     )
                                                                // }
                                                                style={{
                                                                    minWidth:
                                                                        "60px",
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <Button
                                                                variant="primary"
                                                                // onClick={() =>
                                                                //     addToCart(
                                                                //         product.id,
                                                                //         event
                                                                //     )
                                                                // }
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card.Link>
                                            </div>
                                            <div className="col-6">
                                                <Link
                                                    to={{
                                                        pathname: `/products/${product.id}`,
                                                        state: {
                                                            name: product.name,
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
            ) : (
                "error con el servidor"
            )}
            <div className="container mt-5">
                <Link className="ml-5" to="/">
                    <Button variant="outline-primary" size="lg">
                        Regresar
                    </Button>
                </Link>
            </div>
        </section>
    );
}

export default withRouter(Category);
