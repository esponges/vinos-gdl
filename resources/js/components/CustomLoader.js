import React, { useState } from "react";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const CustomLoader = ({ size }) => {
    const params = size;

    return (
        <div id="loader-container">
            <Loader type="ThreeDots" color="#3490dc" height={params ?? 100} width={params ?? 100} />
        </div>
    );
};

export default CustomLoader;
