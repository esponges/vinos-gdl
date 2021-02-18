import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, ListGroupItem } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { withRouter, Link } from 'react-router-dom';

const Category = (props) => {
    const [products, setProducts] = useState({});
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(3);
    const [pageCount, setPageCount] = useState(0);

    const getProducts = async () => {
        try {
            const res = await axios
            .get(`/categories/${props.match.params.name}`);
            const data = res.data;
            const slice = data.slice(offset, offset + perPage); // define item range of each page
            setProducts(slice);

            setPageCount(Math.ceil(res.data.length / perPage));
        } catch (err) {
            console.error(err);
        }
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(Math.ceil(selectedPage * perPage)); // offset will set correctly the items displayed by page
    };

    useEffect(() => {
        getProducts();
    }, [offset]); // updated every pagination click

    return (
        <section className="container mb-2">
            {/* {console.log("rendering Category.js", products)} */}
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
                                                                style={{
                                                                    minWidth:
                                                                        "60px",
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <Button variant="primary">
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
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}

                    pageCount={pageCount}

                    marginPagesDisplayed={2} // # last pages buttons displayed - for long lists
                    pageRangeDisplayed={5} // # total buttons displayed

                    onPageChange={handlePageClick}

                    // bootstrap class for every item
                    breakClassName={"page-item"}
                    containerClassName={"pagination"}
                    pageLinkClassName={"page-link"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    nextClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                />

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
