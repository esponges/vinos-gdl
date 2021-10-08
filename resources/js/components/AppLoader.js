import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const AppLoader = () => {
    return (
        <>
            <App />
        </>
    );
};

export default AppLoader;

ReactDOM.render(<AppLoader />, document.getElementById("root"));
