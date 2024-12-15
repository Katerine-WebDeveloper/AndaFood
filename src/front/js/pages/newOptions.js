import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/loginnavbar";
import Swal from 'sweetalert2'

export const NewOption = () => {
    const [image, setImage] = useState(null);
    const [product, setProduct] = useState({
        name: "",
        price: ""
    });

    const navigate = useNavigate();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handlePublish = async (event) => {
        event.preventDefault();

        if (!product.name || !product.price || !image) {
            alert("Por favor, complete todos los campos y suba una imagen.");
            return;
        }

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('img', image);
        formData.append('price', product.price);

        try {
            const resp = await fetch(process.env.BACKEND_URL + '/api/menuoptions', {
                method: 'POST',
                body: formData
            });

            if (!resp.ok) {
                mensaje2('No se pudo publicar la opción. Intenta nuevamente.');
                return;
            }

            const data = await resp.json();
            console.log(data);
            mensaje('Otra opción creada con éxito!');


            navigate("/menu");
        } catch (error) {
            console.error("Error:", error);
            mensaje2("Hubo un error al publicar la opción.");
        }
    };

     const mensaje = (titulo,icon="success" ,title="") => {
            Swal.fire({
                icon: icon,
                title: title,
                text: titulo,
    
            });
        }
        const mensaje2 = (titulo,icon="error" ,title="") => {
            Swal.fire({
                icon: icon,
                title: title,
                text: titulo,
    
            });
        }





    return (
        <>
            <Navbar />

            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="col-md-8 col-lg-6 order-md-1 bg-light p-4 rounded">
                    <h4 className="mt-5">Otras Opciónes</h4>
                    <form className="needs-validation" noValidate onSubmit={handlePublish}>
                        <div className="mb-3">
                            <label htmlFor="name">Opciónes</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder=""
                                value={product.name}
                                required
                                onChange={(event) => setProduct({ ...product, name: event.target.value })}
                            />
                            <div className="invalid-feedback">El nombre es obligatorio.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="price">Precio</label>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                placeholder=""
                                value={product.price}
                                required
                                onChange={(event) => setProduct({ ...product, price: event.target.value })}
                            />
                            <div className="invalid-feedback">El precio es obligatorio.</div>
                        </div>

                        {!image && (
                            <div className="input-group mb-3">
                                <input
                                    type="file"
                                    className="form-control"
                                    id="inputimage"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        )}

                        {image && (
                            <div className="col-12 my-2">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Vista previa"
                                    className="img-thumbnail"
                                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                                />
                            </div>
                        )}

                        {image && (
                            <div className="col-12 my-2">
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => setImage(null)}
                                >
                                    Borrar Imagen
                                </button>
                            </div>
                        )}

                        <div className="d-grid gap-2 mb-2">
                            <button className="btn btn-primary" type="submit">
                                Subir Menú
                            </button>
                        </div>
                        <div className="mt-3">
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={() => navigate("/admin")}
                            >
                              <i class="fa-solid fa-bowl-food"></i>  Volver a Aministración de Comedor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
