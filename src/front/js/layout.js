import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Form } from "./component/form";
import { Navbar } from "./component/loginnavbar";
import { Footer } from "./component/loginfooter";
import { Admin } from "./component/admin.js";
import {Register} from "./component/register";
import { Menu } from "./component/menu";
import { Payment } from "./component/payment";
import { PlaceReservations } from "./pages/placeReservations";
import {NewMenu} from "./pages/newMenu";
import { NewOption } from "./pages/newOptions";
import { SendEmail } from "./component/send-email";
import { RecuperarPassword } from "./component/recuperar-password";
import { PaymentCash} from "./component/finalPaymentProcess";




//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;


    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop> 
                {/* {location.pathname !== "/menu" && <Navbar />} Es un condicional que hace que el navbar de login no se vea en menu, si hay duda, consultar a Facu */}
                    <Routes>

                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<PlaceReservations />} path="/reservations" />
                        <Route element={<Menu />} path="/menu" />
                        <Route element={<Admin/>} path="/admin" />

                        <Route element={<Payment />} path="/payment" />
                        <Route element={<Form />} path="/form" />                    
               
                        <Route element={<NewMenu />} path="/newMenu" />
                        <Route element={<RecuperarPassword />} path="/recuperar-password" />
                        <Route element={<SendEmail />} path="/send-email" />
                        <Route element={<NewOption />} path="/newOptions" />
                        <Route element={<PaymentCash />} path="/finalPaymentProcess" />
                        <Route element={<h1>Not found!</h1>} />

                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
