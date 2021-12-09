import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Table, Column, AutoSizer } from 'react-virtualized';
import { withRouter } from 'react-router';
import { Form } from 'react-bootstrap';

import 'react-virtualized/styles.css';
import { renderCurrency, renderCategory } from '../../utilities/helpers';
import { useUrlParams, useUrlParamsHandler } from '../controls/hooks/misc';

const defaultParams = {
  sortBy: 'updatedAt', sortDir: 'desc', search: '', page: '1',
};

const ProductList = function ({ history, location }) {
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const areProductsSet = products?.length > 0;

  const urlParams = useUrlParams(location.search, defaultParams);
  // const onSortChange = useUrlParamsHandler({ history, location });
  const onSearchChange = useUrlParamsHandler({ history, location, key: 'search' });

  useEffect(() => {

  }, [])

  return (
    // Render your table
    <div>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={urlParams.search} onChange={onSearchChange} />
      </Form.Group>
      <AutoSizer>
        {({ width }) => (
          <Table
            width={width}
            height={window.innerHeight - 300}
            headerHeight={20}
            rowHeight={60}
            // autoHeight
            rowCount={areProductsSet ? products.length : 0}
            rowGetter={areProductsSet ? ({ index }) => products[index] : () => { }}
            // onColumnClick={(data) => console.log(data)}
            sortDirection="DESC"
          >
            <Column
              label="Nombre"
              dataKey="name"
              width={width * 0.7}
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
            />
          </Table>

        )}
      </AutoSizer>

    </div>
  );
};

export default withRouter(ProductList);
