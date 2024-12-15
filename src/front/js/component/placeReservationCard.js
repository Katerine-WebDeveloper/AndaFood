
import React, { useState, useEffect } from "react";

export const PlaceReservationCard = ({ dia, hora, actualizarReserva }) => {

    const [horaSeleccionada, setHoraSeleccionada] = useState(hora || "");
    const [reserva, setReserva] = useState(hora ? "Tienes reserva" : "Sin reserva");

    useEffect(() => {
        setHoraSeleccionada(hora || "");
        setReserva(hora ? "Tienes reserva" : "Sin reserva");
    }, [hora]);

    const seleccionarHora = (hora) => {
        setHoraSeleccionada(hora);
        setReserva("Tienes reserva"); 
        actualizarReserva(hora);
    };

    const listaHoras=["11:30", "12:00", "12:30", "13:00", "13:30"];

    return (
        <div className="d-flex flex-wrap">
            <div
                className="card my-1 py-1"
                style={{
                    width: "20rem",
                    borderRadius: "25px",
                    borderStyle: "solid",
                    borderWidth: "4px",
                    borderColor: "#3865E5",
                }}
            >
                <div className="card-body">
                    <div className="">
                        <div className="d-flex justify-content-between">
                            <h5 className="card-title mb-3">{ dia }</h5>
                            <h5 className="card-title mb-3">
                                Hora: {horaSeleccionada || "--"}
                            </h5>

                            <div className="btn-group dropend">
                                <button
                                    className="btn btn-primary btn-sm dropdown-toggle px-3 rounded-pill"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Hora
                                </button>
                                <ul
                                    className="dropdown-menu border border-dark"
                                    style={{
                                        width: "max-content",
                                        borderRadius: "15px",
                                    }}
                                >
                                    {listaHoras.map(
                                        (hora, index) => (
                                            <li key={index}>
                                                <h6
                                                    className="dropdown-item my-0"
                                                    onClick={() => seleccionarHora(hora)}
                                                >
                                                    {hora}
                                                </h6>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                        <p className="card-subtitle mb-2 text-body-secondary">
                            <strong>{reserva}</strong>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
