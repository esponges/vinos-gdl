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

    //add 1 item
    const addOneMore = (i, id) => {
        axios
            .get(`cart/${id}/add/1`)
            .then(() => {
                // update count visibility
                const updatedCart = [...cart];
                updatedCart[i].quantity = parseInt(updatedCart[i].quantity) + 1; //the property comes as string, must parse to int first.

                setCart(updatedCart);
                // update cart total
                setTotal(
                    // map a subtotal array
                    updatedCart
                        .map((item) => item.price * item.quantity)
                        //then sum mapped items for total
                        .reduce((a, b) => a + b, 0)
                );
            })
            .catch((err) => {
                setError(err.message);
            });
        // call method from parent App.js
        props.cartCountUpdate(1);
    };

    // remove all items with given id
    const removeItem = (productToRemove, productId, qty) => {
        console.log('remove item')
        axios
        .get(`/cart/${productId}/destroy`)
        .then(() => {
            const updatedCart = cart.filter(
                (product) => product !== productToRemove
            );
            setCart(updatedCart); // clear item from cart list
            setTotal(updatedCart.map(item => item.quantity * item.price).reduce((a, b) => a + b, 0));
            props.cartCountUpdate(qty * -1);
        })
        .catch( err => {
            setCart( err.message );
        });
        console.log('end of removeitem')
    };

    // set cart items and total
    useEffect(() => {
        axios
            .get("cart")
            .then((res) => {
                // cart items
                setCart(Object.values(res.data));
                // cart total
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
                {console.log('rendering')}
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
                                                src={`/img/${product.id}.jpg`}
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
                                                        product.id,
                                                        product.quantity
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
