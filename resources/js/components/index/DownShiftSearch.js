import Downshift from "downshift";
import React, { useEffect, useState, useContext } from "react";
import { withRouter, useHistory } from "react-router";

const DownShiftSearch = (props) => {
    const [products, setProducts] = useState("");

    const onChange = (selectedProduct) => {
        console.log("redirecting to ", selectedProduct.id);
        props.history.push(`/products/${selectedProduct.id}`);
    };

    useEffect(() => {
        let isMounted = true; // bug in downshift when mounting. Fixed by isMounted variable.

        console.log('useEffect from DownshiftSearch')
        axios
            .get("/products")
            .then((res) => {
                if (isMounted) setProducts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

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
