import React from "react";

const MainJumbo = () => {
    return (
        <div>
            <div className="jumbotron center">
                <div className="row">
                    <div className="col-md-8">
                        <h1>VINOREO</h1>
                        <p className="lead">
                            Consigue el vino que requieras para tu evento o
                            consumo en casa sin salir de tu casa.
                        </p>
                    </div>
                    <div className="col-md-4 center">
                        <img src="img/delivery.png" />
                    </div>
                </div>

                <hr className="my-4" />
                <p>No pagues precios inflados. Producto garantizado.</p>
                <p className="lead"></p>
            </div>
        </div>
    );
};

export default MainJumbo;
