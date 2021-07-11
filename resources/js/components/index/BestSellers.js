import React, { useContext } from "react";
import { Context } from "../Context";

import ProductCard from "../elements/ProductCard";
import CustomLoader from "../CustomLoader";

const BestSellers = ({ setItemCount, handleItemAddClick, itemCount }) => {
    const context = useContext(Context);
    const bestSellers = context.allProducts;

    return (
        <div>
            {!context.loader && bestSellers.length > 0 ? (
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
                        {/* {console.log('im gonna map now', 'best sellers btw is ', bestSellers)} */}
                        {bestSellers.map((product) => {
                            if (product.best_seller === 1) {
                                return (
                                    <ProductCard
                                        key={product.id}
                                        data-testid={`best-seller-${product.id}`}
                                        product={product}
                                        itemCount={itemCount}
                                        setItemCount={setItemCount}
                                        handleItemAddClick={handleItemAddClick}
                                    />
                                );
                            }
                        })}
                    </div>
                </section>
            ) : bestSellers.length > 0 ? (
                <CustomLoader />
            ) : (
                ""
            )}
        </div>
    );
};

export default BestSellers;
