import React from "react";

const MainJumbo = () => {
    return (
        <div>
            <div className="jumbotron center">
                <div className="row">
                        <img src="/img/vinoreologo.png" alt="" style={{ maxWidth: "100%" }}/>
                </div>

                <hr className="my-4" />
                <p className="lead mt-4">Precios <i><u>siempre</u></i> de mayoreo</p>
                <div className="mt-2 text-md-right" style={{ fontSize : "0.8rem" }}>
                    <p>*Adquiere nuestros precios a partir de 1,500 mxn de compra.</p>
                </div>

            </div>
        </div>
    );
};

export default MainJumbo;
