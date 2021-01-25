import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Footer from "../index/Footer";
import IndexNavbar from "../index/IndexNavbar";
import Loader from "../../loader.gif";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Cart = (props) => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (e) => {
        console.log(e.target.value);
    };

    const addOneMore = (i, id) => {
        axios
            .get(`cart/${id}/add`)
            .then(() => {
                const updatedCart = [...cart];
                updatedCart[i].quantity += 1;
                setCart(updatedCart);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const removeItem = (productToRemove, productId) => {
        axios
        .get(`/cart/${productId}/destroy`)
        .then(() => {
            setCart(cart.filter((product) => product !== productToRemove)); // remove just that product from cart
        })
        .catch( err => {
            setCart( err.message );
        })
    }


    useEffect(() => {
        axios
            .get("cart")
            .then((res) => {
                // console.log(res.data);
                setCart(Object.values(res.data));
            })
            .catch((err) => {
                // console.log(err.message);
                setError(err.message);
            });
    }, []);

    return (
        <div>
            {/* {console.log(Object.values(cart))} */}
            <div>
                <h1>Tu vinos seleccionados</h1>
                {cart.length == 0 ? (
                    "No tienes vinos en el carrito"
                ) : (
                    <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th></th>
                                <th>Cantidad</th>
                                <th>Sub-Total</th>
                                {/* <th>Acciones</th> */}
                            </tr>
                        </thead>
                        {cart.map((product, i) => {
                            return (
                                <tbody key={i}>
                                    <tr>
                                        <td>
                                            <h5>{product.name}</h5>
                                        </td>
                                        <td className="center">
                                            <img src="img/bottle.png" style={{ width: "85px", height: "85px" }} />
                                        </td>
                                        <td>
                                            <Button variant="success">
                                                {product.quantity}
                                            </Button>
                                            <Button
                                                variant="link"
                                                onClick={() =>
                                                    addOneMore(i, product.id)
                                                }
                                            >
                                                <b>&nbsp; ¡Una más!</b>
                                            </Button>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() =>
                                                    removeItem(
                                                        product,
                                                        product.id
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                        <td>
                                            {product.quantity * product.price}
                                        </td>
                                        {/* <td>
                                            <Button variant="primary" size="sm">
                                                <input
                                                    type="number"
                                                    className="input-number"
                                                    value={product.quantity}
                                                    onChange={handleChange}
                                                />
                                                Añade
                                            </Button>
                                            <a>
                                                Borrar
                                            </a>
                                        </td> */}
                                    </tr>
                                </tbody>
                            );
                        })}
                    </Table>
                )}
                {cart.length == 0 ? (
                    <Link to="/">
                        <Button> Regresar </Button>
                    </Link>
                ) : (
                    <Link to="/cart/checkout">
                        <Button> Pagar </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Cart;
