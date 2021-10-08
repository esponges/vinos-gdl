import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";

const AppLoader = () => {
    return (
        <>
            <App />
        </>
    );
};

export default AppLoader;

ReactDOM.render(
    <HashRouter>
        <AppLoader />
    </HashRouter>,
    document.getElementById("root")
);
