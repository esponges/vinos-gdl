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
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState([]);

    const handleChange = (e) => {
        console.log(e.target.value);
    };

    //update view
    const addOneMore = (i, id, price) => {
        axios
            .get(`cart/${id}/add`)
            .then(() => {
                const updatedCart = [...cart];
                updatedCart[i].quantity += 1;
                setCart(updatedCart);
                setTotal(
                    // map a subtotal array
                    updatedCart
                        .map((item) => {
                            return item.price * item.quantity;
                        })
                        //then sum mapped items for total
                        .reduce((a, b) => a + b, 0)
                );
            })
            .catch((err) => {
                setError(err.message);
            });
        props.updateCart();
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
                setCart(Object.values(res.data));
                setTotal(
                    // map a subtotal array
                    Object.values(res.data).map((item) => {
                        return item.price * item.quantity;
                    })
                    //then sum mapped item
                    .reduce((a, b) => a + b, 0)
                );
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    return (
        <div>
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
                                            <img
                                                src="img/bottle.png"
                                                style={{
                                                    width: "85px",
                                                    height: "85px",
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="success">
                                                {product.quantity}
                                            </Button>
                                            <Button
                                                variant="link"
                                                onClick={() =>
                                                    addOneMore(i, product.id, product.price)
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
                                    </tr>
                                </tbody>
                            );
                        })}
                    </Table>
                )}
                <h5>Total {total}</h5>
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
