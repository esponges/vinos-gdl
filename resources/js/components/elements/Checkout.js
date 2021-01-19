import React from "react";

const Checkout = () => {
    return (
        <div>
            <IndexNavbar />
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Ingresa correo" />
                    <Form.Text className="text-muted">
                        Aquí te llegará la información
                    </Form.Text>
                </Form.Group>
                <Form.Label>Tu CP</Form.Label>
                <Form.Control as="select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Form.Control>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Dirección completa</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="La dirección de tu casa"
                    />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Footer />
        </div>
    );
};

export default Checkout;
