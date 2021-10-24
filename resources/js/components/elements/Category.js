import React, { useState, useEffect, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Context } from '../Context';
import axios from 'axios';

import { Card, ListGroup, Button, ListGroupItem } from 'react-bootstrap';
import CustomLoader from '../CustomLoader';
import ProductCard from './ProductCard';

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
            <h1 className="mt-5">{props.match.params.name}</h1>
            {products != {} && !context.loader ? (
                <div className="row mt-3">
                    {Object.values(products).map((product) => {
                        if (product.is_available) {
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    itemCount={itemCount}
                                    setItemCount={
                                        setItemCount
                                    }
                                    handleItemAddClick={
                                        handleItemAddClick
                                    }
                                />
                            );
                        }
                    })}
                </div>
            ) : (
                <CustomLoader />
            )}
            <div className="container mt-5">
                <ReactPaginate
                    previousLabel={"anterior"}
                    nextLabel={"sig."}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2} // # last pages buttons displayed - for long lists
                    pageRangeDisplayed={4} // # total buttons displayed
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

                <Link to="/">
                    <Button variant="outline-primary" size="lg">
                        Regresar
                    </Button>
                </Link>
            </div>
        </section>
    );
}

export default withRouter(Category);
