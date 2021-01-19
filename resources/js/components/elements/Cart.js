import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Footer from "../index/Footer";
import IndexNavbar from "../index/IndexNavbar";
import Loader from "../../loader.gif";
import { Card } from 'react-bootstrap';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (e) => {
        console.log(e.target.value);
    }

    useEffect(() => {
        axios
            .get("cart")
            .then((res) => {
                // console.log(res.data);
                setCart(res.data);
            })
            .catch((err) => {
                // console.log(err.message);
                setError(err.message);
            });
    }, []);

    return (
        <div>
            {/* {console.log(Object.values(cart))} */}
            <div className="container" style={{ marginTop: "15%" }}>
                <IndexNavbar />
                <h1>Tu vinos seleccionados</h1>
                {cart.length == 0 ? (
                    "No tienes vinos en el carrito"
                ) : (
                    <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Sub-Total</th>
                                {/* <th>Acciones</th> */}
                            </tr>
                        </thead>
                        {Object.values(cart).map((product) => {
                            return (
                                <tbody key={product.id}>
                                    <tr>
                                        <td>
                                            <h5>{product.name}</h5>
                                        </td>
                                        <td>
                                            {product.quantity}
                                            <Card.Link href="#" onClick={() => product.quantity + 1}>
                                                <b>&nbsp; ¡Una más!</b>
                                            </Card.Link>
                                            <Card.Link href="#">
                                                Eliminar
                                            </Card.Link>
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
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
