import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import homeImage from "../../img/home.png";
import { Navbar } from "../component/loginnavbar"


export const Login = () => {
	const { store, actions } = useContext(Context);

	const navigate = useNavigate()

	const [user, setUser] = useState({ email: "" })

	const loginUser = async () => {
		const resp = await actions.login(user)
		if (resp.status && !resp.rol) {
			navigate("/menu")
		}

		if (resp) {
			console.log(store.user)
			if(store.user.is_admin){
				navigate("/admin")
			}
			
			if(user.email == "administrador@anda.com"){
				navigate("/admin")
			}
		}
	}

	return (
		<>
			<Navbar />


			<div className="mt-5 mx-auto d-flex flex-wrap justify-content-center login" >

				<div className="text-center">
					<img className="loginimage" src={homeImage} alt="Descripción de la imagen" />
				</div>
				<div className="form content" style={{ width: "370px" }}>
					<h1>Iniciar sesión</h1>
					<div className="mb-3">
						<label className="form-label">Correo electrónico</label>
						<input type="email" value={user.email || ""} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
							onChange={event => setUser({
								...user,
								email: event.target.value
							})} />
					</div>

					<div className="mb-3">
						<label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
						<input type="password" value={user.password || ""} className="form-control" id="exampleInputPassword1"
							onChange={event => setUser({
								...user,
								password: event.target.value
							})} />
					</div>

					<div className="d-flex justify-content-center">

						<button type="submit" className="btn btn-primary botonlogin "
							onClick={() =>
								loginUser()
							}>Entrar
						</button>
					</div>

					<div className="text-center mt-2">
						<Link to= {"/send-email"} className="custom-link">
						<p>¿Olvidaste tu contraseña?</p>
						</Link>
					</div>

					<div className="text-center mt-2">
						<Link to={"/register"} className="custom-link">
							<p className="text-info">Registrarse</p></Link>
					</div>

				</div>
			</div>
		</>
	);
};
