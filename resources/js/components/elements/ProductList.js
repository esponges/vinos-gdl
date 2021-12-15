import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Table, Column, AutoSizer } from 'react-virtualized';
import { withRouter } from 'react-router';
import { Form } from 'react-bootstrap';

import 'react-virtualized/styles.css';
import {
  renderCurrency, renderCategory, nameLinkRenderer, listActionsRenderer,
} from '../../utilities/helpers';
import { useAddItemToCart, useUrlParams, useUrlParamsHandler } from '../controls/hooks/misc';

const defaultParams = {
  sortBy: 'updatedAt', sortDir: 'DESC', search: '', page: '1',
};

const ProductList = ({ history, location }) => {
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const [searchFilteredProducts, setSearchFilteredProducts] = useState([]);

  const productsListToUse = searchFilteredProducts.length === 0 ? products : searchFilteredProducts;
  const areProductsSet = productsListToUse.length > 0;

  const urlParams = useUrlParams(location.search, defaultParams);
  const onSearchChange = useUrlParamsHandler({ history, location, key: 'search' });

  useEffect(() => {
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(urlParams.search.toLowerCase()));
    setSearchFilteredProducts(filteredProducts);
  }, [urlParams.search]);

  const handleAddItemToCart = useAddItemToCart();

  return (
    // Render your table
    <div className="list__products">
      <Form.Group controlId="formBasicEmail" className="list__products__search-input mb-3 pb-3">
        <Form.Label>Búsqueda</Form.Label>
        <Form.Control type="text" placeholder="¿Qué buscas?" value={urlParams.search} onChange={onSearchChange} />
      </Form.Group>
      <AutoSizer>
        {({ width }) => (
          <Table
            width={width}
            height={window.innerHeight - 300}
            headerHeight={20}
            rowHeight={60}
            rowCount={areProductsSet ? productsListToUse.length : 0}
            rowGetter={areProductsSet ? ({ index }) => productsListToUse[index] : () => { }}
            sortDirection={urlParams.sortDir}
          >
            <Column
              label="Nombre"
              dataKey="name"
              width={width * 0.7}
              cellRenderer={nameLinkRenderer}
            />
            <Column
              width={width * 0.1}
              label="Categoría"
              dataKey="category_id"
              cellRenderer={({ cellData }) => renderCategory(cellData, categories)}
            />
            <Column
              width={width * 0.1}
              label="Precio"
              dataKey="price"
              cellRenderer={({ cellData }) => renderCurrency(cellData)}
            />
            <Column
              width={width * 0.2}
              label=""
              dataKey=""
              cellRenderer={({ rowData: { id, price } }) => listActionsRenderer(id, price, handleAddItemToCart)}
            />
          </Table>
        )}
      </AutoSizer>

    </div>
  );
};

export default withRouter(ProductList);
