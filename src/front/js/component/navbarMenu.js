import React, { useState, useEffect, useContext, useActionState } from "react";
import andalogofood from "../../img/anda.png";
import userlogo from "../../img/user.webp";

import { Link } from 'react-router-dom';
import { SelectedMenuData } from "./cardMenu";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const MenuNavbar = (props) => {

  const [spinner, setSpinner] = useState(false);
  const { actions, store } = useContext(Context)
  const navigate = useNavigate();
  const { listCart } = useContext(SelectedMenuData);
  const logout = () => {
    localStorage.removeItem("access_token");
    setStore({ user: null, token: null, auth: false });
    console.log("Sesión cerrada");
  };

  const handleLogout = () => {
    actions.logout();
    navigate("/");
  }

  const handleCompra = async () => {
    if (listCart.length === 0) {
      alert("El carrito está vacío. Por favor, añade productos antes de pagar.");
    } else {
      setSpinner(true)
      setTimeout(() => {
        setSpinner(false)
        irAPayment();
      }, 2000)
    }
  };

  const irAPayment = () => {
    navigate("/payment");
  };

  return (
    <nav className="navbar bg-body-tertiary">

      <div className="container-fluid d-flex justify-content-between align-items-center" >

        <div href="#offcanvasScrolling" data-bs-toggle="offcanvas" role="button" aria-controls="offcanvasScrolling">
          <img src={andalogofood} alt="Anda Food Logo" style={{ width: "50px", height: "50px", marginRight: "10px", "borderRadius": "10px" }} />
        </div>

        {/* imagen user, perfil usuario */}
        <div className="offcanvas offcanvas-start coloroffcanvas" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">

          <div className="offcanvas-header">
            <div className="d-flex flex-column mx-auto">

              <div className="text-center" >
                <img className="rounded" src={userlogo} alt="Anda Food Logo" style={{ width: "80px", height: "80px", "borderRadius": "10px" }} />
              </div>

              <h6 className="offcanvas-title text-center" id="offcanvasScrollingLabel">
                Nombre usuario: {store.user && store.user.name || "Katerine"} {store.user && store.user.last_name || "Céspedes"}
              </h6>
              <h6 className="offcanvas-title text-center" id="offcanvasScrollingLabel">
                N° funcionario: {store.user && store.user.num_funcionario}
              </h6>
              <h6 className="offcanvas-title text-center" id="offcanvasScrollingLabel">Correo: {store.user && store.user.email}</h6>
            </div>

            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>


          <div className="offcanvas-body d-flex flex-column justify-content-between">
              <div>

                <Link to={"/reservations"} className="custom-link">
                  <div className="feedbacklink my-2">
                    <i className="fa-solid fa-calendar-days me-2" style={{ color: "#3865e5" }}></i> Reservar lugar</div>
                </Link>

                <Link to={"/form"} className="custom-link customhover">
                  <div className="feedbacklink my-2">
                    <i className="fa-solid fa-envelope me-2" style={{ color: "#3865e5" }}></i>
                    Déjanos tu comentario
                  </div>
                </Link>
              </div>




              <div className="text-end pb-2">
                <button className="logout" onClick={handleLogout}>Cerrar Sesión <i className="fa-solid fa-right-from-bracket" style={{ color: "#ffffff" }}></i></button>
              </div>

            </div>


          </div>
         
      

        {/* El carrito de compras */}

        <div className="shoppingCart d-flex">


          <div className="flex-direction-column">

            <Link to={"/reservations"} className="custom-link">
              <button className="btn m-1 " type="button" style={{ backgroundColor: "rgb(56, 101, 229)", "color": "white" }}>
                Reserva de lugar</button>
            </Link>


            <button className="btn m-1 " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTwo" aria-controls="offcanvasTwo" style={{ "backgroundColor": "rgb(56, 101, 229)", "color": "white" }}>
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
          </div>

          {/* Ventana */}
          <div
            className="offcanvas offcanvas-end"
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabIndex="-1"
            id="offcanvasTwo"
            aria-labelledby="offcanvasTwoLabel"
          >
            {/* Título */}
            <div
              className="offcanvas-header canvasheader"
            >
              <h1 className="text-light"><i className="fa-solid fa-cart-shopping"></i>Carrito</h1>
            </div>

            {/* Body */}
            <div
              className="listCart offcanvas-body position-relative"
            >
              {props.spinner && (
                <div
                  className="spinner-grow d-flex justify-content-center"
                  role="status"
                  style={{ backgroundColor: "#3865e5" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}

              {listCart.length === 0 ? (
                <p>El carrito está vacío.</p>
              ) : (
                listCart.map((item, index) => (
                  <div
                    key={item.id}
                    className="d-flex align-items justify-content-evenly"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="foodImage d-flex justify-content-center align-items-center">
                      <img src={item.img} />
                    </div>

                    <div
                      className="foodName d-flex justify-content-center align-items-center"
                      style={{ color: "#3865e5" }}
                    >
                      {item.day}
                    </div>

                    <div
                      className="foodName d-flex justify-content-center align-items-center"
                      style={{ color: "#3865e5" }}
                    >
                      {item.name}
                    </div>

                    <div
                      className="precioTotal d-flex justify-content-center align-items-center"
                      style={{ color: "#3865e5" }}
                    >
                      {item.price}
                    </div>

                    <div className="cantidad d-flex justify-content-center align-items-center">
                      <span
                        className="menos"
                        style={{
                          width: "30px",
                          height: "30px",
                          color: "white",
                          backgroundColor: "#3865e5",
                          borderRadius: "10%",
                          cursor: "pointer",
                          margin: "0 10px",
                          textAlign: "center",
                        }}
                      >
                        {"<"}
                      </span>
                      <span className="text-center">1</span>
                      <span
                        className="mas"
                        style={{
                          width: "30px",
                          height: "30px",
                          color: "white",
                          backgroundColor: "#3865e5",
                          borderRadius: "10%",
                          cursor: "pointer",
                          margin: "0 10px",
                          textAlign: "center",
                        }}
                      >
                        {">"}
                      </span>
                    </div>
                  </div>
                ))
              )}

              <div className="btn position-absolute bottom-0 start-0 end-0 d-flex justify-content-between">
                <button
                  type="button"
                  className="close align-self-start"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  VOLVER
                </button>
                <button
                  className="pay align-self-end text-light btn-success"
                  id="process-checkout"
                  onClick={() => handleCompra()}
                >
                  IR A PAGAR
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </nav>
  )
};