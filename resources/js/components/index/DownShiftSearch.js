import Downshift from "downshift";
import React, { useContext } from "react";
import { withRouter } from "react-router";
import { Context } from "../Context";

const DownShiftSearch = (props) => {
    const products = useContext(Context);

    const onChange = (selectedProduct) => {
        console.log("redirecting to ", selectedProduct.id);
        props.history.push(`/products/${selectedProduct.id}`);
    };

    return (
        <Downshift
            onChange={onChange}
            itemToString={(item) => (item ? item.name : "")}
        >
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
                getRootProps,
            }) => (
                <div>
                    <div
                        style={{ display: "inline-block" }}
                        {...getRootProps({}, { suppressRefError: true })}
                    >
                        <input
                            {...getInputProps()}
                            placeholder="buscar vino"
                            id="product-search-input"
                        />
                    </div>
                    <ul {...getMenuProps()}>
                        <div className="downshift-dropdown">
                            {/* {console.log(products)} */}
                            {isOpen && inputValue.length > 3
                                ? products
                                      .filter(
                                          (item) =>
                                              !inputValue ||
                                              item.name
                                                  .toLowerCase()
                                                  .includes(
                                                      inputValue.toLowerCase()
                                                  )
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
                                                          highlightedIndex ===
                                                          index
                                                              ? "lightgray"
                                                              : "white",
                                                      fontWeight:
                                                          selectedItem === item
                                                              ? "bold"
                                                              : "normal",
                                                  },
                                              })}
                                          >
                                              {item.name}
                                          </li>
                                      ))
                                : null}
                        </div>
                    </ul>
                </div>
            )}
        </Downshift>
    );
};

export default withRouter(DownShiftSearch);
