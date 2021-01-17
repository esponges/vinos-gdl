import React from "react";
import Home from "./Home";
import ReactDOM from 'react-dom';

const App = () => {
    return (
        <div>
            <Home />
        </div>
    );
};

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
