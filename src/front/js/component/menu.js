import React, { useState, useEffect, useContext } from "react";
import menu from "../../img/menu.webp";
import userlogo from "../../img/user.webp";
import "../../styles/shoppingCart.css";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "/src/front/styles/home.css";
import { CardMenu } from "./cardMenu";
import { CardOption } from "./cardOptions";
import { MenuNavbar } from "./navbarMenu";
import { SelectedMenuData } from "./cardMenu";
import { SelectedOptionData } from "./cardOptions";

export const Menu = () => {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [listCart, setListCart] = useState([]);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("listCart"));

    // Validate if the stored cart data is correct
    if (carritoGuardado && Array.isArray(carritoGuardado)) {
      setListCart(carritoGuardado);
    } else {
      // If the data is invalid or empty, start with an empty cart
      setListCart([]);
    }
  }, []);

  useEffect(() => {
    // Only update localStorage if the listCart has valid data
    if (listCart && Array.isArray(listCart)) {
      localStorage.setItem("listCart", JSON.stringify(listCart));
    }
  }, [listCart]);


  const decrecer = () => { };

  const acrecentar = () => { };

  useEffect(() => {
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    days.forEach(day => actions.getMenu(day));
    actions.getOptions();
  }, []);

  const irAReservaDeLugar = () => {
    navigate("/reservations");
  };


  // **Mueve el return al cuerpo principal del componente**
  return (
    <SelectedMenuData.Provider value={{ selectedMenu, setSelectedMenu, listCart, setListCart }}>
      <SelectedOptionData.Provider value={{ selectedOption, setSelectedOption, listCart, setListCart }}>
        <div className="container">

          <MenuNavbar />

          <div className="mb-5">
           <div className="menusemanal align-content-center"  style={{ backgroundImage: `url(${menu})` }}>
            <h2 className="text-center menusemanaltitle" style={{ color: "rgb(255, 255, 255)", padding: "10px"}}>
              <i className="fa-solid fa-calendar-days"></i> MENÚ SEMANAL
            </h2>
           </div>
            {store.user?.is_admin && (
              <div className="text-end mb-3">
                <button
                  className="btn btn-danger m-2"
                  type="button"
                  onClick={() => navigate("/newMenu")}
                >
                  <i class="fa-solid fa-bowl-food"></i> Volver a Nuevo Menú
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => navigate("/newOptions")}
                >
                  <i class="fa-solid fa-bowl-food"></i> Volver a Otras opciones
                </button>
              </div>
            )}
            <div className="row">
              {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"].map((day) => (
                <div
                  key={day}
                  className=" mt-1"
                  style={{
                    marginBottom: "20px",
                    fontFamily: "Mulish, sans-serif",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <h2 className="text-center mb-2 menudeldia2" style={{ color: "rgb(255, 255, 255)" }}>{day}</h2>
                  <div className="row">
                    {store[`menu${day}`] && store[`menu${day}`].map((menu) => (
                      <CardMenu key={menu.id} menu={menu}/>
                    ))}
                  </div>
                  </div>
              ))}
                </div>

            {/* <div className="container my-4">
            <h1 className="text-center mb-2" style={{ fontFamily: "Mulish, sans-serif", color: "rgb(56, 101, 229)" }}>
              OTRAS OPCIONES
            </h1>
            <div
              className="menudeldia2 mt-3"
              style={{
                marginBottom: "20px",
                fontFamily: "Mulish, sans-serif",
                backgroundColor: "rgba(56, 101, 229, 0.2)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex flex-wrap justify-content-center">
                {store.menuOptions.map((option) => (
                  <div key={option.id} className="m-2" style={{ flex: "1 0 auto", maxWidth: "200px" }}>
                    <CardOption option={option} />
                  </div>
                ))}
              </div>
            </div>
          </div> */}

                < div className = "container my-4" >
  <h1 className="text-center mb-2" style={{ fontFamily: "Mulish, sans-serif", color: "rgb(56, 101, 229)" }}>
    OTRAS OPCIONES
  </h1>
  <div
    className="carousel slide"
    id="optionsCarousel"
    data-bs-ride="carousel"
    style={{
      marginBottom: "20px",
      fontFamily: "Mulish, sans-serif",
      backgroundColor: "rgba(56, 101, 229, 0.2)",
      padding: "10px",
      borderRadius: "10px",
    }}
  >
    {/* Items */}
    <div className="carousel-inner">
      {store.menuOptions.reduce((slides, option, index) => {
        const slideIndex = Math.floor(index / 4);
        if (!slides[slideIndex]) slides[slideIndex] = [];
        slides[slideIndex].push(option);
        return slides;
      }, []).map((group, slideIndex) => (
        <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}>
          <div className="d-flex justify-content-center flex-wrap">
            {group.map((option) => (
              <div key={option.id} className="m-2" style={{ flex: "1 0 auto", maxWidth: "200px" }}>
                <CardOption option={option} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Controls */}
    {["prev", "next"].map((direction) => (
      <button
        key={direction}
        className={`carousel-control-${direction}`}
        type="button"
        data-bs-target="#optionsCarousel"
        data-bs-slide={direction}
      >
        <span className={`carousel-control-${direction}-icon`} aria-hidden="true"></span>
        <span className="visually-hidden">{direction === "prev" ? "Previous" : "Next"}</span>
      </button>
    ))}
  </div>
</div>


          </div>
        </div>
      </SelectedOptionData.Provider>
    </SelectedMenuData.Provider>
  );
};
