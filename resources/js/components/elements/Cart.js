import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Table, Alert } from "react-bootstrap";

const Cart = (props) => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState([]);
    const [totalAlert, setTotalAlert] = useState(null);
    const [payOrCheckout, setPayOrCheckout] = useState("Pagar");
    const [addOrRemoveDisabled, setAddOrRemoveDisabled] = useState(false);

    const addOneMore = async (id, i) => {
        try {
            const res = await axios.get(`cart/${id}/add/1`);
            // if res true
            if (res) {
                const updatedCart = [...cart];
                updatedCart[i].quantity = parseInt(updatedCart[i].quantity) + 1; //the property comes as string, must parse to int first.
                setCart(updatedCart);

                //set new total
                const newCartTotal = updatedCart
                    .map((item) => item.quantity * item.price)
                    .reduce((a, b) => a + b, 0);
                setTotal(newCartTotal);
                isTotalAboveMin(newCartTotal);

                // update navbar +1 cart count
                props.cartCountUpdate(1);
            } else {
                console.error("error fecthing add route");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // remove all items from given id
    const removeItem = async (productToRemove, productId, qty) => {
        try {
            const res = await axios.get(`/cart/${productId}/destroy`);
            // positive response
            if (res) {
                const updatedCart = cart.filter(
                    (product) => product !== productToRemove
                );
                setCart(updatedCart);
                // get total to pay
                const newCartTotal = updatedCart
                    .map((item) => item.quantity * item.price)
                    .reduce((a, b) => a + b, 0);
                setTotal(
                    newCartTotal
                );
                isTotalAboveMin(newCartTotal);
                // remove all item count from navbar counter
                props.cartCountUpdate(qty * -1);
            } else {
                console.error("error fetching delete route");
            }
            // res not true
        } catch (err) {
            console.error(err, "try failed, got catch");
        }
    };

    //check if total > 1,500 mxn
    const isTotalAboveMin = (cartTotal, e) => {
        // e.preventDefault();
        if (cartTotal < 1500) {
            console.log('cart total is ', cartTotal)
            setTotalAlert(true);
        } else {
            console.log("cart total is ", cartTotal);
            setTotalAlert(false);
        }


    };

    // set cart items and total
    useEffect(() => {
        console.log("useEffect from Cart.js");
        let isMounted = true;

        axios
            .get("cart")
            .then((res) => {
                if (isMounted) {
                    // cart items
                    setCart(Object.values(res.data));
                    // cart total
                    setTotal(
                        // map a subtotal array
                        Object.values(res.data)
                            .map((item) => {
                                return item.price * item.quantity;
                            })
                            //then sum mapped item
                            .reduce((a, b) => a + b, 0)
                    );
                }
            })
            .catch((err) => {
                setError(err.message);
            });

            //unmount
            return () => isMounted = false;
    }, []);

    return (
        <div>
            <div>
                {console.log("Rendering Cart.js")}
                <h1>Tu vinos seleccionados</h1>
                {cart.length == 0 ? (
                    <p>"No tienes vinos en el carrito"</p>
                ) : (
                    <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Producto</th>
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
                                                src={`/img/products/${product.id}.jpg`}
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
                                                    addOneMore(product.id, i)
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
                                                disabled={addOrRemoveDisabled}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                        <td>
                                            $ {product.quantity * product.price}
                                        </td>
                                    </tr>
                                </tbody>
                            );
                        })}
                    </Table>
                )}
                <div className="container mt-3">
                    <h3 className="mb-3">
                        Total <b>$ {total}</b>
                    </h3>
                    {total < 1500 && (
                        <Alert variant={"warning"}>
                            Adquiere un mínimo de 1500mxn en compra para poderte dar nuestros precios de mayoreo
                        </Alert>
                    )}
                    {cart.length == 0 ? (
                        <Link to="/">
                            <Button> Regresar </Button>
                        </Link>
                    ) : (
                        <div className="row">
                            <div className="col-3">
                                {/* check if client can pay */}
                                <Link to="/cart/checkout">
                                    <Button
                                        variant="outline-success"
                                        size="lg"
                                        disabled={total < 1500 ? true : false}
                                    >
                                        {" "}
                                        {payOrCheckout}{" "}
                                    </Button>
                                </Link>
                            </div>
                            <div className="col-3">
                                <Link to="/">
                                    <Button variant="outline-secondary">
                                        Regresar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
