import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/loginnavbar";
import Swal from 'sweetalert2'


export const NewMenu = () => {
    const [menus, setMenus] = useState([]);
    const [currentMenu, setCurrentMenu] = useState({
        day: "",
        name: "",
        description: "",
        price: "",
        image: null,
    });

    const navigate = useNavigate();



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentMenu((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCurrentMenu((prev) => ({ ...prev, image: file }));
        }
    };

    const [product, setProduct] = useState({
        day: "",
        name: "",
        description: "",
        price: "",
        img: null
    });

    const handlePublish = async (event) => {
        event.preventDefault();
        console.log("Publish the new product", product, image);

        const formData = new FormData();

        formData.append('day', product.day);
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('img', image);
        formData.append('price', product.price);

        const resp = await fetch(process.env.BACKEND_URL + 'api/menu', {
            method: 'POST',
            body: formData
        });
    };

    const addMenu = () => {
        if (!currentMenu.day || !currentMenu.name || !currentMenu.description || !currentMenu.price || !currentMenu.image) {
            mensaje("Por favor, complete todos los campos y suba una imagen.");
            return;
        }

        setMenus([...menus, currentMenu]);
        setCurrentMenu({
            day: "",
            name: "",
            description: "",
            price: "",
            image: null,
        });
    };

    const removeMenu = (index) => {
        setMenus(menus.filter((_, i) => i !== index));
    };

    const handlePublishAll = async () => {
        if (menus.length === 0) {
            mensaje("No hay menús para enviar.");
            return;
        }

        try {
            for (const menu of menus) {
                const formData = new FormData();
                formData.append("day", menu.day);
                formData.append("name", menu.name);
                formData.append("description", menu.description);
                formData.append("price", menu.price);
                formData.append("img", menu.image);

                const resp = await fetch(process.env.BACKEND_URL + "api/menu", {
                    method: "POST",
                    body: formData,
                });

                if (!resp.ok) {
                    mensaje2("Error al enviar un menú");
                    return;
                }
            }
            mensaje("Todos los menús fueron enviados exitosamente");
            setMenus([]);
            navigate("/menu");
        } catch (error) {
            console.error("Error:", error);
            mensaje2("Hubo un error al enviar los menús.");
        }
    };
    const mensaje = (titulo,icon="success" ,title="Menú creado con exito!") => {
        Swal.fire({
            icon: icon,
            title: title,
            text: titulo,

        });
    };

    const mensaje2 = (titulo,icon="success" ,title="") => {
                Swal.fire({
                    icon: icon,
                    title: title,
                    text: titulo,
        
                });
            }
    
        
        return (
            <>
                <Navbar />
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        paddingTop: "150px",
                        paddingBottom: "80px",
                        minHeight: "100vh",
                        overflowY: "auto",
                        padding: "20px",
                        boxSizing: "border-box",

                    }}
                >
                    <div className="col-md-8 col-lg-6 order-md-1 bg-light p-4 rounded">
                        <h4 className="mt-5">MENÚ NUEVO</h4>
                        <form className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="day">Día</label>
                                    <input
                                        type="text"
                                        name="day"
                                        className="form-control"
                                        value={currentMenu.day}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="name">Nombre del Menú</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={currentMenu.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description">Descripción del Menú</label>
                                <input
                                    type="text"
                                    name="description"
                                    className="form-control"
                                    value={currentMenu.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="price">Precio</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="form-control"
                                    value={currentMenu.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="file"
                                    className="form-control"
                                    id="inputimage"
                                    onChange={handleImageUpload}
                                />

                            </div>

                            {currentMenu.image && (
                                <div className="col-12 my-2">
                                    <img
                                        src={URL.createObjectURL(currentMenu.image)}
                                        alt="Preview"
                                        className="img-thumbnail"
                                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                                    />
                                </div>
                            )}

                            <div className="d-grid gap-2 mb-2">
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={addMenu}
                                >
                                    Agregar Menú
                                </button>
                            </div>
                        </form>

                        <h5 className="mt-4">Menús agregados</h5>
                        <ul className="list-group">
                            {menus.map((menu, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {menu.name} - {menu.day}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeMenu(index)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="d-grid gap-2 mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handlePublishAll}
                            >
                                Enviar todos los menús
                            </button>
                        </div>
                        <div className="mt-3">
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => navigate("/admin")}
                            >
                               <i class="fa-solid fa-bowl-food"></i> Volver a Aministración de Comedor
                            </button>
                        </div>
                    </div>
                </div>


            </>
        );
    };
