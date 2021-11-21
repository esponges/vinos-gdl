/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import Downshift from 'downshift';

import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../Context';

library.add(fab, fas);

const DownShiftSearch = function ({ history }) {
  const products = useContext(Context);

  const onChange = (selectedProduct) => {
    history.push(`/products/${selectedProduct.id}`);
  };

  return (
    <div>
      {products.allProducts?.length > 0 ? (
        <Downshift
          onChange={onChange}
          itemToString={(item) => (item ? item.name : '')}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
            getRootProps,
          }) => (
            <div>
              <div
                style={{ display: 'inline-block' }}
                {...getRootProps(
                  {},
                  { suppressRefError: true },
                )}
              >
                <input
                  {...getInputProps()}
                  placeholder="Busca tu  vino"
                  id="product-search-input"
                />
                {' '}
                <FontAwesomeIcon
                  icon={faSearch}
                  color="blue"
                />
              </div>
              <ul {...getMenuProps()}>
                <div className="downshift-dropdown">
                  {isOpen && inputValue.length > 3
                    ? products.allProducts
                      .filter(
                        (item) => !inputValue
                                                    || item.name
                                                    // remove uppercase and special characters then compare
                                                    // search value
                                                      .toLowerCase()
                                                      .normalize('NFD')
                                                      .replace(
                                                        /[\u0300-\u036f]/g,
                                                        '',
                                                      )
                                                      .includes(
                                                        // compare with input value
                                                        inputValue
                                                          .toLowerCase()
                                                          .normalize(
                                                            'NFD',
                                                          )
                                                          .replace(
                                                            /[\u0300-\u036f]/g,
                                                            '',
                                                          ),
                                                      ),
                      )
                      .map((item, index) => (
                        <li
                          className="dropdown-item"
                          {...getItemProps({
                            key: item.id,
                            index,
                            item,
                            style: {
                              backgroundColor:
                                                                highlightedIndex
                                                                    === index
                                                                  ? 'lightgray'
                                                                  : 'white',
                              fontWeight:
                                                                selectedItem
                                                                    === item
                                                                  ? 'bold'
                                                                  : 'normal',
                            },
                          })}
                        >
                          {item.name}
                          {' '}
                          $
                          {item.price}
                        </li>
                      ))
                    : null}
                </div>
              </ul>
            </div>
          )}
        </Downshift>
      ) : (
        ''
      )}
    </div>
  );
};

export default DownShiftSearch;
