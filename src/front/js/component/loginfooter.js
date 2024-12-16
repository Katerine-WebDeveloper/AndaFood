import React, { Component } from "react";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<div>
			<p>
				Derechos reservados
			</p>
		</div>
		<div className="d-flex flex-wrap justify-content-center">

			<div className="d-flex align-item-center me-2">
				<i className="fa-solid fa-phone mt-1 me-1" style={{ color: "#ffff"}}></i>
				<p>2400 0714</p>
			</div>

			<div className="d-flex align-item-center me-2">
				<i className="fa-brands fa-whatsapp mt-1 me-1" style={{ color: "#ffff"}}></i>
				<p>091 278 532</p>
			</div>

			<div className="d-flex align-item-center me-2">
				<i className="fa-brands fa-instagram mt-1 me-1 " style={{ color: "#ffff" }}></i>
				<p>ANDA_UY</p>
			</div>

			<div className="d-flex align-item-center me-2">
				<i className="fa-brands fa-facebook-f mt-1 me-1" style={{ color: "#ffff" }}></i>
				<p>ANDA</p>
			</div>

			<div className="d-flex align-item-center me-2">
				<i className="fa-brands fa-linkedin-in mt-1 me-1" style={{color: "#ffff"}}></i>
				<p>ANDA</p>
			</div>


		</div>
	</footer>
);
