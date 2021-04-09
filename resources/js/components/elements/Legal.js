import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const Legal = (params) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title className="mb-3">
                    <b>Aviso de Privacidad de Vinoreomx</b>
                </Card.Title>
                <Card.Text>
                    Vinoreomx es el responsable del tratamiento de los datos
                    personales que nos proporcione.
                </Card.Text>
                <Card.Text>
                    Los datos personales que recabamos de usted, los
                    utilizaremos para las siguientes finalidades: Registro de
                    usuarios, acreditamiento de mayoría de edad, proceso de
                    entrega, entre otras con fines similares.
                </Card.Text>
                <Card.Text>
                    De manera adicional, utilizaremos su información personal
                    para las siguientes finalidades que no son necesarias, pero
                    que nos permiten y facilitan brindarle una mejor atención:
                    Publicidad y Promociones, Descuentos a clientes frecuentes,
                    análisis de consumidores, entre otras con fines similares.
                </Card.Text>
                <Card.Text>
                    En caso de que no desee que sus datos personales sean
                    tratados para las finalidades adicionales, usted puede
                    manifestarlo mediante correo electrónico a &nbsp;
                    <a href="mailto: hola@vinoreo.mx">hola@vinoreo</a>
                </Card.Text>
                <Card.Text>
                    Le informamos que sus datos personales son compartidos con
                    las personas, empresas, organizaciones y autoridades
                    distintas al sujeto obligado, para los fines que se
                    describen a continuación:
                </Card.Text>
                <Table striped bordered hover className="mt-3 mb-3">
                    <thead>
                        <tr>
                            <th>Destinatario de los datos personales</th>
                            <th>País (opcional)</th>
                            <th>Finalidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Gobierno de Jalisco</td>
                            <td>México</td>
                            <td>Corroborar mayoría de edad</td>
                        </tr>
                        <tr>
                            <td>PayPal</td>
                            <td>EUA</td>
                            <td>
                                Corroborar cuenta y destino de flujos de
                                operaciones
                            </td>
                        </tr>
                        <tr>
                            <td>Licoret Occidental, S.A. de C.V.</td>
                            <td>México</td>
                            <td>
                                Corroborar operaciones de compra y depósitos.
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Card.Text>
                    Si usted no manifiesta su negativa para dichas
                    transferencias, se entenderá que ha otorgado su
                    consentimiento.
                </Card.Text>
                <Card.Text>
                    Para mayor información acerca del tratamiento y de los
                    derechos que puede hacer valer, usted puede acceder al aviso
                    de privacidad integral a través de la dirección electrónica: &nbsp;
                    <a href="">www.vinoreo.mx</a>
                </Card.Text>
                <Link to="/">
                    <Button variant="primary" className="mt-3">
                        Regresar
                    </Button>
                </Link>
            </Card.Body>
        </Card>
    );
};
export default Legal;
