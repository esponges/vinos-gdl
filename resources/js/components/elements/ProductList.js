import React, { useEffect, useState, cloneElement } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Table, Column, AutoSizer } from 'react-virtualized';
import { withRouter } from 'react-router';
import { Form } from 'react-bootstrap';

import 'react-virtualized/styles.css';
import { createSelector } from 'reselect';
import {
  renderCurrency, renderCategory, nameLinkRenderer, listActionsRenderer,
} from '../../utilities/helpers';
import {
  useAddItemToCart, useUrlParams, useUrlParamsHandler, useWindowSize,
} from '../controls/hooks/misc';

const defaultParams = {
  sortBy: 'updatedAt', sortDir: 'DESC', search: '', page: '1',
};

// append style to autoSizer without breaking it by using style prop directly
const originalRender = AutoSizer.prototype.render;
const autoOverflow = { overflow: 'auto' };
AutoSizer.prototype.render = function render() {
  const { allowHorizontalScroll } = this.props;
  const renderedElement = originalRender.call(this);

  return allowHorizontalScroll
    ? cloneElement(renderedElement, { style: autoOverflow })
    : renderedElement;
};

const ProductList = ({ history, location }) => {
  const products = useSelector((state) => state.products.products);
  const orderedProductsByCategoryAndAlphabetical = createSelector(products, (prods) => )
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

  const { isMobile } = useWindowSize();

  return (
    // Render your table
    <div className="list__products">
      <Form.Group controlId="formBasicEmail" className="list__products__search-input mb-3 pb-3">
        <Form.Label>Búsqueda</Form.Label>
        <Form.Control type="text" placeholder="¿Qué buscas?" value={urlParams.search} onChange={onSearchChange} />
      </Form.Group>
      <AutoSizer allowHorizontalScroll>
        {({ width }) => (
          <Table
            width={!isMobile ? width : width * 1.2}
            height={window.innerHeight - 300}
            headerHeight={60}
            rowHeight={60}
            rowCount={areProductsSet ? productsListToUse.length : 0}
            rowGetter={areProductsSet ? ({ index }) => productsListToUse[index] : () => { }}
            sortDirection={urlParams.sortDir}
          >
            <Column
              width={width * (!isMobile ? 0.1 : 0.1)}
              label=""
              dataKey=""
              cellRenderer={({ rowData: { id, price } }) => listActionsRenderer(id, price, handleAddItemToCart, isMobile)}
            />
            <Column
              width={width * 0.1 * (isMobile ? 1.65 : 1)}
              label="Precio"
              dataKey="price"
              cellRenderer={({ cellData }) => renderCurrency(cellData, isMobile)}
            />
            <Column
              label="Nombre"
              dataKey="name"
              width={width * 0.5 * (isMobile ? 1.5 : 1)}
              cellRenderer={nameLinkRenderer}
            />
            {!isMobile
              && (
                <Column
                  width={width * 0.1}
                  label="Categoría"
                  dataKey="category_id"
                  cellRenderer={({ cellData }) => renderCategory(cellData, categories)}
                />
              )}
          </Table>
        )}
      </AutoSizer>

    </div>
  );
};

export default withRouter(ProductList);
