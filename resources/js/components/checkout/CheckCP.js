import axios from "axios";
import Downshift from "downshift";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

const CheckCP = ({getCpInfo, order}) => {
    const [CP, setCP] = useState("");

    const onChange = (selectedCP) => { // will be passed by selectedItem - no need to pass as param in onChange method
        getCpInfo(selectedCP); // pass cp to parent Checkout.js
    };

    useEffect(() => {

        axios
        .get('api/get-CP')
        .then(res=> {
            setCP(res.data);
        })
        .catch(err => {
            console.error(err);
        })

    }, []);

    return (
        <Downshift
            onChange={onChange}
            itemToString={(item) => (item ? item.name + "  " + item.cp : "")} // output in input after click
            resultCount={3}
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
                resultCount,
                getRootProps,
            }) => (
                <div>
                    <div {...getRootProps({}, { suppressRefError: true })}>
                        <input {...getInputProps()} id="get-cp-input" autocomplete="chrome-off"/>
                    </div>
                    <ul {...getMenuProps()} style={{ width: "35%" }}>
                        <div className="downshift-dropdown">
                            {isOpen && inputValue.length > 2
                                ? CP.filter(
                                    (item) =>
                                        !inputValue ||
                                        item.cp.includes(inputValue) || // if only cp is inserted
                                        item.name
                                            .toLowerCase()
                                            .includes(
                                                inputValue.toLowerCase()
                                            ) // if name is inserted
                                ).map((item, index) => (
                                    <li
                                        className="dropdown-item"
                                        {...getItemProps({
                                            key: item.id,
                                            index,
                                            item,
                                            style: {
                                                backgroundColor:
                                                    highlightedIndex === index
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
                                        {"  "}
                                        {item.cp}
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

export default withRouter(CheckCP);
