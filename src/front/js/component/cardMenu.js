import React, { useState, useEffect, useContext, createContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const SelectedMenuData = createContext();

export const CardMenu = ({ menu }) => {

    const [selectedMenu, setSelectedMenu] = useState(null);

    const { listCart, setListCart } = useContext(SelectedMenuData);

    const [showNotification, setShowNotification] = useState(false);

    const handleClick = (menu) => {
        const uniqueId = `${menu.id}-${menu.source}`;
        const existingItemIndex = listCart.findIndex(item => item.uniqueId === uniqueId);
    
        if (existingItemIndex === -1) {
            setListCart([
                ...listCart,
                { ...menu, quantity: 1, newprice: menu.price, uniqueId }
            ]);
        } else {
            const updatedCart = listCart.map((item) => {
                if (item.uniqueId === uniqueId) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        newprice: (item.quantity + 1) * item.price
                    };
                }
                return item;
            });
            setListCart(updatedCart);
        }
    
        // Mostrar notificación
        handleNotificacion();
    };
    
    const handleNotificacion = () => {
        if (!showNotification) {
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 1000); // Ocultar después de 1 segundo
        }
    };
    

    const navigate = useNavigate();

    // export const CardMenu = ({ menu }) => {

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(0);



    const handleClickStar = (newRating) => {
        setRating(newRating);
    };


    const starElements = [];
    for (let i = 1; i <= 5; i++) {
        const filled = i <= rating;
        starElements.push(
            <span key={i} onClick={() => handleClickStar(i)}>
                {filled ? (
                    <i className="fas fa-star " style={{ color: "gold" }}></i>
                ) : (
                    <i className="far fa-star" style={{ color: "gold" }}></i>
                )}
            </span>
        );
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        
        <div key={menu.id} className=" d-flex flex-wrap justify-content-center card rounded-3 p-2 cardmenu mx-auto my-2">
            <div>
                <div>
                    <img src={menu.img} alt={menu.name} className="card-img-top img-fluid rounded-3 menuimg" />

                    <div className="d-flex justify-content-center align-items-center">
                        <div className="position-relative">
                            <h2 className="menuname pt-2 ">
                            {menu.name}
                            </h2>
                        </div>

                     
                    </div>



               

                    {/* Renderizado de notificación */}
                    {showNotification && (
                        <div className="notification">
                            ¡Producto añadido al carrito!
                        </div>
                    )}

                    <div className="card-body text-center p-1 border-top">
                        <div className=" py-1 d-flex justify-content-around align-items-center">

                            <div>
                                <p className="menuprice p-0">
                                ${menu.price}
                                </p>
                            </div>


                            <button className="btn cart" style={{ border: "1px solid rgb(56, 101, 229)", borderRadius: "50%"}}  onClick={() => {
                                handleClick(menu); handleNotificacion();
                            }} >
                                <i className="fa-solid fa-cart-shopping"></i>
                            </button>


                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {/* <div className={`modal fade ${showModal ? "show" : ""}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? "block" : "none", }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{ fontFamily: "Mulish, sans-serif", backgroundColor: "rgba(56, 101, 229)", }}>
                            <h5 className="modal-title" id="exampleModalLabel" style={{ color: "white" }}>
                                Descripción del Menú
                            </h5>

                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={toggleModal}></button>
                        </div>
                        <div className="modal-body d-flex">
                            <img src={menu.img} alt={menu.name} className="img-fluid" style={{ objectFit: "cover", width: "200px", height: "auto", marginRight: "20px", }} />
                            <div>
                                <h5>{menu.name}</h5>
                                <p>Precio: ${menu.price}</p>
                                <p> {menu.description}</p>
                                <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                    <div>{starElements}</div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn" data-bs-dismiss="modal" onClick={toggleModal} style={{ color: "rgb(56, 101, 229)" }}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>

    );
};
