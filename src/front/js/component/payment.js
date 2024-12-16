import React, { useState, useContext, useEffect } from "react"
import andalogofood from "../../img/anda.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Context } from "../store/appContext";
import axios from 'axios';

export const Payment = () => {

    const { actions, store } = useContext(Context);

    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    const pagarEnEfectivo = () => {
        navigate("/finalPaymentProcess"); // Redirige a la página de pago en efectivo
    };
    

    initMercadoPago('APP_USR-95548522-114d-4404-9dfd-408bd646ee05', { locale: "es-UY", });
    const [preferenceId, setPreferenceId] = useState(null)


    const pagar = async () => {
        // const subtotal = 100; 
        const initPoint = await actions.pagoMercadoPago(2024);
        if (initPoint) {
            let url = store.mercadoPago.init_point
            window.location.href = url; // Redirige al cliente
        }
    };

    useEffect(() => {
        // Llamada GET para obtener las órdenes
        const fetchOrders = async () => {
            try {
                const response = await axios.get(process.env.BACKEND_URL + '/api/ordenes');  // Asegúrate de que esta ruta sea la correcta
                setOrders(response.data);  // Suponiendo que la respuesta es un arreglo de órdenes
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // const handleCompra = async () => { const id = await createPreference(); if (id) { setPreferenceId(id); } }; 

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                {/* Título de la sección */}
                <div className="col-12 text-center mb-4">
                    <h1 className="text-primary">Lista de Ordenes</h1>
                    <p className="text-muted">Revisa los detalles de tu pedido antes de proceder con el pago</p>
                </div>

                {/* Lista de Ordenes */}
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

                {/* Opciones de pago */}
                <div className="col-12 col-md-8 text-center mt-5">
                    <h2 className="text-primary mb-4">Elige tu forma de pago</h2>
                    <button onClick={pagar} className="btn btn-success btn-lg mb-3 w-100">
                        Pagar con Mercado Pago
                    </button>
                    <button className="btn btn-secondary btn-lg w-100" onClick={pagarEnEfectivo}>
                        Pagar en Caja al Retirar
                    </button>
                </div>
            </div>
        </div>
    );

};