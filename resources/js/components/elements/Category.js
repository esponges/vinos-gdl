import React, { useState, useEffect, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Context } from '../Context';
import axios from 'axios';

import { Card, ListGroup, Button, ListGroupItem } from 'react-bootstrap';
import CustomLoader from '../CustomLoader';

const Category = (props) => {
    const [products, setProducts] = useState({});
    const [itemCount, setItemCount] = useState(1); // input itemCount

    // pagination
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(8);
    const [pageCount, setPageCount] = useState(0);

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
    }

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
            {products != {} && !context.loader ? (
                <div className="row mt-3">
                    {Object.values(products).map((product) => {
                        return (
                            <div
                                key={product.id}
                                className="col-lg-3 col-md-4 mt-3"
                                id="product-card-mobile"
                            >
                                <Card>
                                    <Link
                                        to={{
                                            pathname: `/products/${product.id}`,
                                        }}
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={`/img/products/${product.id}.jpg`}
                                        />
                                    </Link>
                                    <Card.Body>
                                        <Card.Title>
                                            <b>{product.name}</b>
                                        </Card.Title>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroupItem>
                                            <b>
                                                Precio
                                                {new Intl.NumberFormat(
                                                    "en-US",
                                                    {
                                                        style: "currency",
                                                        currency: "MXN",
                                                    }
                                                ).format(product.price)}
                                            </b>
                                        </ListGroupItem>
                                    </ListGroup>
                                    <Card.Body>
                                        <div className="row">
                                            <div className="col-3 d-none d-sm-block">
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    defaultValue={itemCount}
                                                    value={itemCount}
                                                    min="1"
                                                    className="form-control input-number"
                                                    onChange={async (e) =>
                                                        await setItemCount(
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    style={{
                                                        minWidth: "60px",
                                                    }}
                                                />
                                            </div>
                                            <div className="col-3">
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
                                        {productAddMsg &&
                                            product.id == productAddId && (
                                                <div>
                                                    <Card.Text
                                                        style={{
                                                            color: "red",
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        {" "}
                                                        {productAddMsg}
                                                    </Card.Text>
                                                </div>
                                            )}
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <CustomLoader />
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
