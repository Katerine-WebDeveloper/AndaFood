import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { PlaceReservationCard } from "../component/placeReservationCard";
import { Context } from "../store/appContext"
import Swal from 'sweetalert2'

export const PlaceReservations = () => {

    const { actions, store } = useContext(Context);

    const navigate = useNavigate();
    const volver = () => {
        navigate(-1);
    };

    const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
    const [reservas, setReservas] = useState([{
        "lunes": "",
        "martes": "",
        "miercoles": "",
        "jueves": "",
        "viernes": "",
        "sabado": ""
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
                return { ...prev, [diaSemana]: nuevaHora, };
            });
        setReservas({ ...reservas, [diaSemana]: nuevaHora });
    };


    const guardarReservas = async () => {
        //console.log(reservas["Lunes"]);
        //console.log(actions);
        let resp = await actions.guardarReserva(reservas)
        if (resp) {
            Swal.fire({
                icon: "success",
                title: "Reservas guardadas con éxito",
                text: "",
            });
        } else {
            alert("Hubo un problema al guardar las reservas");
        }
    }


    const eliminarReservas = async () => {
        let resp = await actions.eliminarReserva(reservas)
        if (resp) {
            setReservas({
                "lunes": "--",
                "martes": "--",
                "miercoles": "--",
                "jueves": "--",
                "viernes": "--",
                "sabado": "--"
            });

            Swal.fire({
                icon: "success",
                title: "Reservas eliminadas con éxito",
                text: "",
            });
        } else {
            alert("Hubo un problema al eliminar las reservas");
        }
    }

    return (
        <div className="d-flex flex-column align-items-center mt-3" style={{ marginBottom: "20px", fontFamily: "Mulish, sans-serif" }}>

            <div className="d-flex align-items-center">
                <button className="btn btn-white" style={{ padding: '10px', marginLeft: '10px', marginRight: '30px', cursor: 'pointer', borderRadius: '25px', borderColor: 'gray', backgroundColor: "rgba(56, 101, 229, 0.2)" }}
                    title="Volver al menú"
                    onClick={volver}
                >
                    <div className="d-flex">
                        Menú
                        <i className="fa-solid fa-arrow-left fa-xl ms-1 my-auto"></i>
                    </div>
                </button>
                <h2 className="text-center" style={{ color: "rgb(56, 101, 229)" }}>RESERVAR LUGAR EN COMEDOR</h2>


            </div>

            <div className="col-6 d-flex flex-wrap justify-content-center gap-3">
                {diasSemana.map((dia, index) => (
                    <PlaceReservationCard
                        key={index}
                        dia={dia.charAt(0).toUpperCase() + dia.slice(1)}
                        hora={reservas[dia] || ""}
                        reservas={dia == "lunes" ? store?.reservas[0]?.lunes
                            : dia == "martes" ? store?.reservas[0]?.martes
                                : dia == "miercoles" ? store?.reservas[0]?.miercoles
                                    : dia == "jueves" ? store?.reservas[0]?.jueves
                                        : dia == "viernes" ? store?.reservas[0]?.viernes
                                            : dia == "sabado" ? store?.reservas[0]?.sabado
                                                : null}
                        actualizarReserva={(nuevaHora) => actualizarReserva(dia, nuevaHora)}
                    />

                ))}
            </div>

            <div className="container d-flex justify-content-center mx-auto my-3">
                <button className="btn btn-dark" style={{ width: "20rem", padding: '10px', marginLeft: '7px', marginRight: '7px', cursor: 'pointer', borderRadius: '25px' }}
                    title="Eliminar reserva"
                    onClick={() => eliminarReservas()}
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
    )
}
