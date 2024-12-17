import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import userRegisterImage from "../../img/user.webp";
import Swal from 'sweetalert2'
import { Navbar } from "./loginnavbar";


export const Register = () => {

    const navigate = useNavigate();
    const volver = () => {
        navigate(-1);
    };

    const { store, actions } = useContext(Context);
    const [name, setName] = useState("")
    const [last_name, setLast_name] = useState("")
    const [num_funcionario, setNum_funcionario] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmar, setConfirmar] = useState("")
    const [shown, setShown] = useState(false);
    const switchShown = () => setShown(!shown);
    const [isAdmin, setIsAdmin] = useState(false)
    const mensaje = (titulo) => {
        Swal.fire({
            icon: "Error",
            title: "Error de ingreso",
            text: titulo,

        });
    }



    const signup = async (e) => {
        e.preventDefault()

        if (name == "") {
            mensaje("Falta ingresar el nombre")
            return
        }
        if (last_name == "") {
            mensaje("Falta ingresar el apellido")
            return
        }
        if (num_funcionario == "") {
            mensaje("Falta ingresar el numero de funcionario")
            return
        } if (email == "") {
            mensaje("Falta ingresar el email")
            return
        }
        if (password == "") {
            mensaje("Falta ingresar el contraseña")
            return
        }
        if (password.length > 20 || password.length < 8) {
            mensaje("El password debe contenter de 8 a 20 caracteres")
            return

        }
        if (confirmar == "") {
            mensaje("Falta ingresar la confirmacion de contraseña")
            return
        }
        if (confirmar != password) {
            mensaje(" La contraseña no coincide con la confirmacion")
            return
        }
        let newUser = {
            name: name,
            last_name: last_name,
            num_funcionario: num_funcionario,
            email: email,
            password: password,
            is_admin: isAdmin

        }
        let resp = await actions.signup(newUser)

        if (resp) {
            let userLogin = {
                email: email,
                password: password

            }

            let respLogin = await actions.login(userLogin);

            if (respLogin == !isAdmin) {
                navigate("/admin");
                Swal.fire({
                    icon: "success",
                    title: "Usuario registrado con éxito",
                    text: "Bienvenido",
                });
            } else {
                navigate("/menu");
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Bienvenido al menú",
                });
            }

        }
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto pt-5" style={{ width: "350px" }}>
                <div className="text-center pt-5">
                    <h1 className="text-center pt-4">Registrarse</h1>
                    <img className="registeruser" src={userRegisterImage} alt="Descripción de la imagen" />
                </div>


                <div className="mb-2">
                    <label className="form-label">Nombres</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="form-control" id="exampleFormControlInput1" placeholder="Nombres" />
                </div>
                <div className="mb-2">
                    <label className="form-label">Apellidos</label>
                    <input type="text" value={last_name} onChange={(event) => setLast_name(event.target.value)} className="form-control" id="exampleFormControlInput2" placeholder="Apellidos" />
                </div>
                <div className="mb-2">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="form-control" id="exampleFormControlInput13" placeholder="Email" />
                </div>
                <div className="mb-2">
                    <label className="form-label">Número de funcionario</label>
                    <input type="text" value={num_funcionario} onChange={(event) => setNum_funcionario(event.target.value)} className="form-control" id="exampleFormControlInput4" placeholder="" />
                </div>
                <div className="mb-2">
                    <label className="form-label">Contraseña</label>
                    <div className="d-flex">
                        <input type={shown ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} id="inputPassword6" className="form-control" aria-describedby="passwordHelpInline" />
                        <button onClick={switchShown} className="btn btn-outline-primary">
                            {shown ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                        </button>
                    </div>
                    <span id="passwordHelpInline" className="form-text">
                        Debe contener de 8 a 20 caracteres.
                    </span>
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar contraseña</label>
                    <div className="d-flex">
                        <input type={shown ? 'text' : 'password'} value={confirmar} onChange={(event) => setConfirmar(event.target.value)} id="inputPassword7" className="form-control" aria-describedby="passwordHelpInline" />
                        <button onClick={switchShown} className="btn btn-outline-primary">
                            {shown ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                        </button>
                    </div>
                    <div className="form-check form-switch mt-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            onChange={() => setIsAdmin(!isAdmin)}
                            checked={isAdmin}
                        />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            Soy Administrador
                        </label>
                    </div>
                </div>
                <div className="text-center mb-4">
                    <button type="button" onClick={(event) => signup(event)} className="btn btn-primary m-2">Registrarse</button>
                    <button type="button" onClick={volver} className="btn btn-primary ms-2">Volver</button>
                </div>



            </div>
        </>
    )
}

