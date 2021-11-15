import React, { useCallback, useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Context } from '../Context';

import CustomLoader from '../CustomLoader';
import BestSellers from './BestSellers';
import ProductCard from '../elements/ProductCard';

library.add(fas);

const ProductGrid = ({ productsByCategories }) => {
  const [itemCount, setItemCount] = useState(1);
  const categories = productsByCategories;
  const context = useContext(Context);

  const handleItemCount = useCallback((count) => {
    setItemCount(count);
  }, [setItemCount]);

  return (
    <>
      <div>
        <BestSellers
          itemCount={itemCount}
          setItemCount={setItemCount}
        />
      </div>
      {!_.isEmpty(categories)
                && categories[0].map((category) => (
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
                            textAlign: 'center',
                            fontSize: '3rem',
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
                                        handleItemCount
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
                              surtido de
                              {' '}
                              {category.category_name}
                              !
                            </Button>
                          </Link>
                        </div>
                      </section>
                    ) : (
                      <CustomLoader />
                    )}
                  </div>
                ))}
    </>
  );
};

export default ProductGrid;
