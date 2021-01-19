import React from 'react';
import Footer from '../index/Footer';
import IndexNavbar from '../index/IndexNavbar';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { withRouter } from 'react-router';

const SingleProduct = (props) => {
    const product = props.location.state;

    return (
        <>
            {/* {console.log(props.location.state)} */}
            <IndexNavbar />
            {product ? (
                <Card style={{ width: "18rem", marginTop: "10%" }}>
                    <Card.Img variant="top" src="img/bottle.png" />
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>
                            {product.description}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Precio: $ {product.price}</ListGroupItem>
                        <ListGroupItem>Vestibulum at eros</ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        <Card.Link href="#">Card Link</Card.Link>
                    </Card.Body>
                </Card>
            ) : (
                ""
            )}
            <Footer />
        </>
    );
}

export default withRouter(SingleProduct);
