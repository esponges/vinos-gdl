import React, { useContext } from "react";
import _ from "lodash";
import { Context } from "../Context";

import ProductCard from "../elements/ProductCard";
import CustomLoader from "../CustomLoader";
import { useSelector } from "react-redux";

const BestSellers = ({ setItemCount, itemCount }) => {
    const context = useContext(Context);
    const products = useSelector(state => state.categories.categories)

    return (
        <div>
            {!context.loader && !_.isEmpty(products) && !_.isEmpty(products.best_sellers) ? (
                /* somehow I was getting empty object for bestSellers which was crashing app */
                <section className="container mb-2" id="best_sellers">
                    <h1
                        className="mt-5 center"
                        style={{
                            textAlign: "center",
                            fontSize: "3rem",
                        }}
                    >
                        <span className="badge badge-secondary">
                            Best Sellers
                        </span>
                    </h1>
                    <div className="row mt-3">
                        {products.best_sellers.map((product) => {
                            if (product.best_seller === 1) {
                                return (
                                    <ProductCard
                                        key={product.id}
                                        data-testid={`best-seller-${product.id}`}
                                        product={product}
                                        itemCount={itemCount}
                                        setItemCount={setItemCount}
                                    />
                                );
                            }
                        })}
                    </div>
                </section>
            ) : !_.isEmpty(products) ? (
                <CustomLoader />
            ) : (
                ""
            )}
        </div>
    );
};

export default BestSellers;
