import Downshift from "downshift";

import React, { useContext, useState } from "react";
import { Context } from "../Context";

import { withRouter } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faSearch } from "@fortawesome/free-solid-svg-icons";
library.add(fab, fas);

const DownShiftSearch = (props) => {
    const [inputProduct, setInputProduct] = useState("");
    const products = useContext(Context);


    const onChange = (selectedProduct) => {
        props.history.push(`/products/${selectedProduct.id}`);
    };

    return (
        <div>
            {products.allProducts?.length > 0 ? (
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
                                {...getRootProps(
                                    {},
                                    { suppressRefError: true }
                                )}
                            >
                                <input
                                    {...getInputProps()}
                                    placeholder={`Busca tu  vino`}
                                    id="product-search-input"
                                />
                                &nbsp;{" "}
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    color={"blue"}
                                />
                            </div>
                            <ul {...getMenuProps()}>
                                <div className="downshift-dropdown">
                                    {isOpen && inputValue.length > 3
                                        ? products.allProducts
                                            .filter(
                                                (item) =>
                                                    !inputValue ||
                                                    item.name
                                                        // remove uppercase and special characters then compare
                                                        // search value
                                                        .toLowerCase()
                                                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                                        .includes(
                                                            // compare with input value
                                                            inputValue.toLowerCase()
                                                            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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
                                                                selectedItem ===
                                                                item
                                                                    ? "bold"
                                                                    : "normal",
                                                        },
                                                    })}
                                                >
                                                    {item.name} ${item.price}
                                                </li>
                                            ))
                                        : null}
                                </div>
                            </ul>
                        </div>
                    )}
                </Downshift>
            ) : (
                ""
            )}
        </div>
    );
};

export default withRouter(DownShiftSearch);
