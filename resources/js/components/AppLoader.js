import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from '../store/store';


const AppLoader = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default AppLoader;

ReactDOM.render(
    <HashRouter>
        <AppLoader />
    </HashRouter>,
    document.getElementById("root")
);
