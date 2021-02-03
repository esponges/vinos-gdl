import React, { useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { withRouter } from 'react-router';

const SingleProduct = (props) => {
    const [itemCount, setItemCount] = useState(1);
    // const product = props.location.state;
    const [product, setProduct] = useState({})

    const addToCart = (id, event) => {
        event.preventDefault();
        console.log(`item ${id}, cantidad ${itemCount}`);
        axios
            .get(`cart/${id}/add/${itemCount}`)
            .then((res) => {
                props.cartCountUpdate(itemCount);
                window.alert(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // get product info
        axios
        .get(`/products/${props.match.params.id}`)
        .then(res => {
            setProduct(res.data);
        })
        .catch((err) => {
            console.error(err)
        });
    }, [])

    return (
        <>
            {console.log(product)}
            {product != {} && (
                <Card style={{ width: "32rem", marginTop: "10%", marginBottom: "10%" }}>
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
                            Compara precios: Walmart/Consuvino
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
                                    onChange={async (e) =>
                                        await setItemCount(e.target.value)
                                    }
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
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </>
    );
}

export default withRouter(SingleProduct); // HOC to access match, location and history
