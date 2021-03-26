import React from "react";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const CustomLoader = () => {
    return (
        <div id="loader-container">
            <Loader type="ThreeDots" color="#3490dc" height={100} width={100} />
        </div>
    );
};

export default CustomLoader;
