import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import userRegisterImage from "../../img/user.webp";
import Swal from 'sweetalert2'
import { Navbar } from "../component/loginnavbar"

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
    const [isAdmin, setIsAdmin] = useState(false);

    const mensaje = (titulo) => {
        Swal.fire({
            icon: "error",
            title: "error de ingreso",
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
        // nuevo dato del nuevo usuario
        let resp = await actions.signup(newUser)

        if (resp) {
            let userLogin = {
                email: email,
                password: password

            }

            let respLogin = await actions.login(userLogin);

            if (respLogin ==!isAdmin ) {
                navigate("/menu");
                Swal.fire({
                    icon: "success",
                    title: "Usuario registrado con éxito",
                    text: "Bienvenido",
                });
            } else {
                navigate("/admin");
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

            <Navbar/>

            <div className="mx-auto register" style={{ width: "350px" }}>
                <div className="text-center">
                    <h1 className="text-center pt-4">Registrarse</h1>
                    <img className="registeruser" src={userRegisterImage} alt="Descripción de la imagen" />
                </div>


                <div className="mb-2">
                    <label className="form-label">Nombres</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="form-control" id="exampleFormControlInput1" placeholder="Nombres" />
                </div>
                <div className="form-check form-switch">
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
        </>
    )
}
