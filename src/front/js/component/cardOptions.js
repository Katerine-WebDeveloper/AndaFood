import React, { useState, useEffect, useContext, createContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const SelectedOptionData = createContext();

export const CardOption = ({ option }) => {


  const { selectedOption, setSelectedOption, listCart, setListCart } = useContext(SelectedOptionData);

  const [showNotification, setShowNotification] = useState(false);

  const handleClick = (option) => {
    // Crear un ID único basado en el ID y el source
    const uniqueId = `${option.id}-${option.source}-${Date.now()}`;
  
    // Verifica si el artículo ya está en el carrito usando el uniqueId
    const existingItemIndex = listCart.findIndex(item => item.uniqueId === uniqueId);
  
    if (existingItemIndex === -1) {
      // Si el artículo no está en el carrito, lo agregamos con cantidad 1
      setListCart([
        ...listCart,
        { ...option, isOption: true, quantity: 1, newprice: option.price, uniqueId } // Agregamos el uniqueId al objeto
      ]);
    } else {
      // Si el artículo ya está en el carrito, actualizamos la cantidad y el precio
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
  
      // Actualizamos el carrito con los valores modificados
      setListCart(updatedCart);
    }
  
    console.log("Item seleccionado: ", option);
  };
  




  const handleNotificacion = () => {
    if (!showNotification) {
      console.log("Mostrando notificación...");
      setShowNotification(true);
      setTimeout(() => {
        console.log("Ocultando notificación...");
        setShowNotification(false);
      }, 700);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center flex-wrap gap-4" style={{ rowGap: "20px" }}>
        <div key={option.id} className="d-flex flex-column align-items-center" style={{ width: "150px" }}>
          <div
            className="card"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src={option.img}
              className="card-img-top"
              alt={option.name}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          <div
            className="text-center mt-2"
            style={{
              fontSize: "10px",
              fontFamily: "Mulish, sans-serif",
            }}
          >
            <h5
              className="card-title"
              style={{
                color: "rgb(56, 101, 229)",
                fontSize: "15px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {option.name}
            </h5>
            <p
              className="card-text m-2"
              style={{
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Precio: ${option.price}
            </p>

            <button
              className="btn"
              onClick={() => {
                handleClick(option);
                handleNotificacion();
              }}
              style={{
                backgroundColor: "rgb(56, 101, 229)",
                color: "white",
                fontSize: "0.8rem",
                borderRadius: "10px",
                padding: "5px 10px",
              }}
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
            </div>
<<<<<<< HEAD

            
             {/* Renderizado de notificación */}
             {showNotification && (
                        <div className="notification">
                            ¡Producto añadido al carrito!
                        </div>
                    )}

        </div>
=======
            
          </div>
>>>>>>> 8670901220e729bc2f8098918f1546ba601fa0b3
    </div>
  );
};  