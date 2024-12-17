import React from "react";
import { Navbar } from "../component/loginnavbar";
import foodimg from "../../img/food.png";
import othersimg from "../../img/others.png";
import "/src/front/styles/home.css";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


export const Admin = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        actions.logout();
        navigate("/");
    }
    const { actions, store } = useContext(Context)

    return (
        <>

            <div className="adminmenu">
                <div className="admincomedor d-flex justify-content-between">
                    <h1 className=" fs-4"> <i class="fa-solid fa-bowl-food me-2" style={{ color: "#ffffff" }}></i>Administración de Comedor</h1>
                    <div className="text-end pb-2">
                        <button className="logout2" onClick={handleLogout}>Cerrar Sesión <i className="fa-solid fa-right-from-bracket" style={{ color: "#ffffff" }}></i></button>
                    </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center align-items-center adminmenu">
                    <Link to={"/newMenu"} className="custom-link">
                        <div className="cardadmin m-4 p-3">
                            <h2 className="text-center">Añadir menú</h2>
                            <img className="menuadmin" src={foodimg} alt="Descripción de la imagen" />
                        </div>

                    </Link>

                    <Link to={"/newOptions"} className="custom-link">
                        <div className="cardadmin m-4 p-3">
                            <h2 className="text-center">Añadir otros</h2>
                            <img className="menuadmin2" src={othersimg} alt="Descripción de la imagen" />
                        </div>
                    </Link>


                </div>

            </div>

        </>
    )
}