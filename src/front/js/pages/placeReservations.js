import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { PlaceReservationCard } from "../component/placeReservationCard";
import { Context } from "../store/appContext"
import "../../styles/home.css";
import { Navbar } from "../component/loginnavbar"

export const PlaceReservations = () => {

    const { actions, store } = useContext(Context);

    const navigate = useNavigate();
    const volver = () => {
        navigate(-1);
    };

    const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    const [reservas, setReservas] = useState([{
        "Lunes": "",
        "Martes": "",
        "Miercoles": "",
        "Jueves": "",
        "Viernes": "",
        "Sabado": ""
    }]);

    useEffect(() => {
        fetchReservas();
    }, []);


    const fetchReservas = async () => {
        let resp = await actions.traerReserva()
    }

    const actualizarReserva = (diaSemana, nuevaHora) => {
        console.log(diaSemana, nuevaHora),
            setReservas((prev) => {
                return {...prev, [diaSemana]: nuevaHora,};
            });
            setReservas({ ...reservas, [diaSemana]: nuevaHora });
    };


    const guardarReservas = async () => {
        console.log(reservas["Lunes"]);
        console.log(actions);
        let resp = await actions.guardarReserva(reservas)
        if (resp) {
            alert("Reservas guardadas con éxito");
        } else {
            alert("Hubo un problema al guardar las reservas");
        }
    }


    return (
        <>
  
        <div className="d-flex flex-column align-items-center mt-4 reserva" style={{ marginBottom: "20px", fontFamily: "Mulish, sans-serif" }}>
         
            <div className="d-flex mb-4">
                <button className="btn btn-white" style={{ padding: '10px', marginLeft: '10px', marginRight: '30px', cursor: 'pointer', borderRadius: '25px', borderColor: 'gray', backgroundColor: "rgba(56, 101, 229, 0.2)" }}
                    title="Volver al menú"
                    onClick={volver}
                >
                    <div className="d-flex">
                        <i className="fa-solid fa-arrow-left fa-xl ms-1 my-auto me-1"></i>
                        Menú
                    </div>
                </button>
                <h2 className="text-center" style={{ color: "rgb(56, 101, 229)" }}>RESERVAR LUGAR EN COMEDOR</h2>
            </div>

            <div className="col-6 d-flex flex-wrap justify-content-center gap-3 mt-5">
                {diasSemana.map((dia, index) => (
                    <PlaceReservationCard key={index} dia={dia} actualizarReserva={actualizarReserva} />
                ))}
            </div>

            <div className="container d-flex justify-content-center mx-auto my-3">
                <button className="btn btn-dark" style={{ width: "20rem", padding: '10px', marginLeft: '7px', marginRight: '7px', cursor: 'pointer', borderRadius: '25px' }}
                    title="Eliminar reserva"
                // onClick={guardarReservas}
                >
                    <div className="d-flex justify-content-center py-auto">
                        <div className="ms-3">
                        Eliminar agenda
                        </div>
                        <i className="fa-solid fa-bucket my-auto ms-3"></i>
                    </div>
                </button>

                <button className="btn btn-success" style={{ width: "20rem", padding: '10px', marginLeft: '7px', marginRight: '7px', cursor: 'pointer', borderRadius: '25px' }}
                    title="Guardar reserva"
                    onClick={guardarReservas}
                >
                    <div className="d-flex justify-content-center py-auto">
                        <div className="ms-2">
                            Guardar agenda
                        </div>
                        <i className="fa-solid fa-check my-auto ms-3"></i>
                    </div>

                </button>
            </div>

        </div>
    </>
    )
}



