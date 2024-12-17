import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export const PaymentCash = () => {
    const [orders, setOrders] = useState([]);
    const { orderId } = useParams(); // Obtén el ID de la orden desde la URL

    useEffect(() => {
        // Llamada GET para obtener los detalles del pedido utilizando el ID de la orden
        const fetchOrder = async () => {
            try {
                const response = await axios.get(process.env.BACKEND_URL + `/api/ordenes/`);
                console.log("Respuesta de la API:", response.data);
                setOrders(response.data);  // Suponiendo que la respuesta es un solo objeto de orden
            } catch (error) {
                console.error("Error al obtener el pedido:", error);
            }
        };

        fetchOrder();
    }, []); // Vuelve a llamar cuando el orderId cambie

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                {/* Título de la sección */}
                <div className="col-12 text-center mb-4">
                    <h1 className="text-primary">¡Pedido Recibido!</h1>
                    <p className="text-muted">Tu pedido ha sido recibido con éxito.</p><br /> 
                    <p>Abonarás al retirar.</p><br /> 
                    <p>Muchas gracias.</p>
                </div>

                {/* Detalles del pedido */}

                <div className="col-12 col-md-8">
                    <div className="list-group">
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <div key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        {/* Mostrar la imagen del producto */}
                                        <img
                                            src={order.menu_img}
                                            alt={order.menu_name}
                                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                            className="me-3"
                                        />
                                        <div>
                                            {/* Mostrar el nombre del producto */}
                                            <strong>{order.menu_name}</strong><br />
                                            {/* <small>Día: {order.menu_day}</small><br /> */}
                                            <small>Cantidad: {order.cantidad}</small>
                                        </div>
                                    </div>
                                    {order.option_name && (
                                        <div className="d-flex align-items-center ms-3">
                                            {/* Mostrar la imagen de la opción */}
                                            <img
                                                src={order.option_img}
                                                alt={order.option_name}
                                                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                                className="me-3"
                                            />
                                            <div>
                                                <strong>{order.option_name}</strong><br />
                                                <small>Opción seleccionada</small>
                                            </div>
                                        </div>
                                    )}
                                    <span className="badge bg-success text-white">
                                        ${order.total_price}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-warning" role="alert">
                                No hay órdenes disponibles en este momento.
                            </div>
                        )}
                    </div>

                </div>

                {/* Botones de navegación */}
                <div className="col-12 col-md-8 text-center mt-5">
                    <h2 className="text-primary mb-4">¿Qué deseas hacer ahora?</h2>
                    <Link to="/menu" className="btn btn-primary btn-lg mb-3 w-100">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};
