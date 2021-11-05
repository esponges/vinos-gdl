import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Context } from "../Context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import CustomLoader from "../CustomLoader";
import BestSellers from "./BestSellers.js";
import ProductCard from "../elements/ProductCard";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/cart/reducers";

library.add(fas);

const ProductGrid = (props) => {
    const [itemCount, setItemCount] = useState(1);
    const categories = props.products;
    const context = useContext(Context);
    const dispatch = useDispatch();

    const handleItemAddClick = (e, id, price) => {
        e.preventDefault();

        context.addToCart(id, itemCount);
        dispatch(fetchCartItems());
        const productSubTotal = price * itemCount;
        context.notifyMinAmountRemaining(productSubTotal);
    };

    return (
        <>
            <div>
                <BestSellers
                    itemCount={itemCount}
                    setItemCount={setItemCount}
                    handleItemAddClick={handleItemAddClick}
                />
            </div>
            {categories &&
                categories[0].map((category) => {
                    return (
                        <div
                            className="mt-2"
                            id={category.category_name}
                            key={category.id}
                        >
                            {!context.loader ? (
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
                                    <div className="container mt-5">
                                        <Link
                                            className="mt-3"
                                            to={`/categories/${category.category_name}`}
                                        >
                                            <Button
                                                variant="outline-primary"
                                                size="lg"
                                            >
                                                ¿Quieres más? ¡Checa todo el
                                                surtido de{" "}
                                                {category.category_name}!
                                            </Button>
                                        </Link>
                                    </div>
                                </section>
                            ) : (
                                <CustomLoader />
                            )}
                        </div>
                    );
                })}
        </>
    );
}

export default ProductGrid;
