import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com"; // Importa EmailJS
import "../../styles/home.css";
import salonComedor from "../../img/salonComedor.png";

export const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primerapregunta: "",
    segundapregunta: "",
  });

  const volver = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_i1tnzaa",
        "template_oyrjojl", 
        formData, 
        "jvtv6LB62iSrSLmYY"
      )
      .then(
        (response) => {
          alert("¡Correo enviado exitosamente!");
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          alert("Ocurrió un error al enviar el correo. Intenta nuevamente.");
          console.error("FAILED...", error);
        }
      );
  };

  return (
    <div className="container p-5">
      <h1 className="text-center">Tu opinión nos importa.</h1>
      <div className="d-flex justify-content-center align-items-center">
        <div>
          <img src={salonComedor} alt="Salón comedor" />
        </div>
        <div className="form-container">
          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="primerapregunta"
                className="form-label"
              >
                ¿Fue de tu agrado la atención y el servicio?
              </label>
              <input
                type="text"
                className="form-control"
                id="primerapregunta"
                name="primerapregunta"
                placeholder="Déjanos tu comentario."
                value={formData.primerapregunta}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="segundapregunta"
                className="form-label"
              >
                ¿Qué te gustaría que mejoremos?
              </label>
              <textarea
                className="form-control"
                id="segundapregunta"
                name="segundapregunta"
                rows="3"
                placeholder="Danos tu aporte para seguir mejorando nuestros servicios."
                value={formData.segundapregunta}
                onChange={handleChange}
                required
              />
            </div>
            <div className="container d-flex justify-content-end my-3">
              <button type="submit" className="btn btn-primary">
                Enviar
              </button>
              <button
                type="button"
                onClick={volver}
                className="btn btn-primary ms-2"
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
