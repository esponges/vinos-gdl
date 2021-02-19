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
                        <input {...getInputProps()} />
                    </div>
                    <ul {...getMenuProps()}>
                        <div>
                            {/* {console.log(products)} */}
                            {isOpen
                                ? products
                                    .filter(
                                        (item) =>
                                            !inputValue ||
                                            item.name.includes(inputValue)
                                    )
                                    .map((item, index) => (
                                        <li
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
