import React from "react";
import { useNavigate } from "react-router-dom";

export const CardOption = ({ option }) => {

  const navigate = useNavigate();

  const irAPayment = () => {
    navigate("/payment");
  };

  const handleClick = (option) => {
    console.log("Item seleccionado: ", option);
  };

  const handleNotificacion = () => {
    alert("¡Producto agregado!");
  };

  return (
      
      <div
      key={option.id}
        className ="d-flex justify-content-center flex-wrap gap-4"
        style={{ rowGap: "20px" }}
      >
          <div
            className="d-flex flex-column align-items-center"
            style={{ width: "150px" }}
          >
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
                alt=""
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
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                { option.name}
              </h5>
              <p
                className="card-text m-2"
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Precio: ${ option.price}
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
            
          </div>
    </div>
    
  );
};