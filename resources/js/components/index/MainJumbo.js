import React from "react";

const MainJumbo = () => {
    return (
        <div>
            <div className="jumbotron center">
                <div className="row">
                    <div className="col-md-8">
                        <h1>VINOREO</h1>
                        <p className="lead">
                            Consigue el vino  gratis a domicilio para tu evento o
                            consumo en casa sin salir de tu casa*.
                        </p>
                        <p className="lead">Precios <i><u>siempre</u></i> de mayoreo**</p>
                    </div>
                    <div className="col-md-4">
                        <img src="img/delivery.png" style={{ textAlign: 'center'}}/>
                    </div>
                </div>

                <hr className="my-4" />
                <p>*Compra mínima 2,000 pesos.</p>
                <p>**En comparación con competencia</p>
                <p className="lead"></p>
            </div>
        </div>
    );
};

export default MainJumbo;
