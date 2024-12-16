import axios from 'axios';
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: null,
			user: null,
			auth: false,
			mercadoPago: {},
			menuLunes: [],
			menuMartes: [],
			menuMiercoles: [],
			menuJueves: [],
			menuViernes: [],
			menuSabado: [],
			optionCocaCola: [],
			optionCocaColaZ: [],
			optionCocaColaL: [],
			optionAgua: [],
			optionNaranja: [],
			optionManzana: [],
			reservas: {}

		},
		actions: {
			// Use getActions to call a function within a function
			pagoMercadoPago: async (total) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/preference", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ total: total })
					});
					const data = await response.json();
					console.log(data);
					setStore({ mercadoPago: data });
					return true;
				} catch (error) {
					console.error("Error al crear la preferencia:", error);
				}
			},
			login: async (useNew) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(useNew)
					})
					console.log(resp.status)
					const data = await resp.json()
					if (resp.ok) {

						console.log(data, "token")
						setStore({ user: data.user, token: data.access_token, auth: true })

						localStorage.setItem("access_token", data.access_token)
						return {
							status: true,
							rol: data.user.is_admin
						};
					}
					setStore({ auth: false })
					return {
						status: false
					}
				} catch (error) {
					console.log("Error loading message from backend", error)
					setStore({ user: false })
					return {
						status: false
					};
				}
			}, logout: () => {
				localStorage.removeItem("access_token");
				setStore({ user: null, token: null, auth: false });
				console.log("Sesión cerrada");
			},
			signup: async (user) => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(user)

					})
					console.log(resp.status)
					if (resp.status == 201) {

						return true;
					} else {
						return false
					}
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			logout: () => {

				localStorage.removeItem("access_token");
				setStore({ user: null, token: null, auth: false });
				console.log("Sesión cerrada");
			},

			getMenu: async (menuDay) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/menu/" + menuDay);
					if (!response.ok) {
						return
					}
					const data = await response.json();
					console.log(data);
					if (menuDay === "Lunes") {
						setStore({ menuLunes: data });
					}
					if (menuDay === "Martes") {
						setStore({ menuMartes: data });
					}
					if (menuDay === "Miercoles") {
						setStore({ menuMiercoles: data });
					}
					if (menuDay === "Jueves") {
						setStore({ menuJueves: data });
					}
					if (menuDay === "Viernes") {
						setStore({ menuViernes: data });
					}
					if (menuDay === "Sabado") {
						setStore({ menuSabado: data });
					}
				} catch (error) {
					console.log(error);
					return false;
				}
			},

			getOptions: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/menuoptions/");

					if (!response.ok) {
						throw new Error('Error en la respuesta del servidor');
					}

					const data = await response.json();
					console.log(data);


					if ("CocaCola") {
						setStore({ optionCocaCola: data });
					}
					if ("CocaCola Zero") {
						setStore({ optionCocaColaZ: data });
					}
					if ("CocaCola Light") {
						setStore({ optionCocaColaL: data });
					}
					if ("Agua") {
						setStore({ optionAgua: data });
					}
					if ("Naranja") {
						setStore({ optionNaranja: data });
					}
					if ("Manzana") {
						setStore({ optionManzana: data });
					}

				} catch (error) {
					console.error("Error al obtener opciones:", error);
				}
			},

			guardarReserva: async (reservas) => {
				console.log(reservas)
				try {
					const token = localStorage.getItem("access_token");
					const response = await fetch(process.env.BACKEND_URL + "api/reservations", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(
							{
								lunes: reservas["lunes"] || "",
								martes: reservas["martes"] || "",
								miercoles: reservas["miercoles"] || "",
								jueves: reservas["jueves"] || "",
								viernes: reservas["viernes"] || "",
								sabado: reservas["sabado"] || "",
							}

						),
					});
					console.log(response);
					if (response.status == 200) {
						return true;
					}
				} catch (error) {
					console.log(error);
					return false;
				}

			},

			traerReserva: async () => {
				try {
					const token = localStorage.getItem("access_token");
					const response = await fetch(process.env.BACKEND_URL + "api/reservations", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},

					});
					console.log(response);
					if (response.status == 200) {
						const data = await response.json();
						setStore({ reservas: data });
						return true;
					} else {
						console.error("Error al obtener las reservas:", response.status);
						return false;
					}
				} catch (error) {
					console.error("Error al traer reservas:", error);
					return false
				}
			},

			
			eliminarReserva: async () => {
				try {
					const token = localStorage.getItem("access_token");
					const response = await fetch(process.env.BACKEND_URL + "api/reservations", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},

					});
					console.log(response);
					if (response.status == 200) {
						getActions().traerReserva()
						return true;
					}
				} catch (error) {
					console.error("Error al eliminar reservas:", error);
					return false
				}
			},

			restablecerPassword: async (email) => {
				try {

					const response = await fetch(process.env.BACKEND_URL + "api/send-email", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: email
						}),
					});
					console.log(response);
					if (response.status == 200) {
						return true;
					}
					if (response.status == 404) {
						return false;
					}
				} catch (error) {
					console.log(error);
					return false;
				}

			},
			recuperarPassword: async (email, aleatorio, password) => {
				try {

					const response = await fetch(process.env.BACKEND_URL + "api/recuperar-password", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email,
							aleatorio,
							password
						}),
					});
					console.log(response);
					if (response.status == 200) {
						return true;
					}
					if (response.status == 404) {
						return false;
					}
				} catch (error) {
					console.log(error);
					return false;
				}

			},

			getProfile: async () => {
				try {
					const token = localStorage.getItem("access_token");
					if(!token){
						return false
					}
					const response = await fetch(process.env.BACKEND_URL + "api/user/profile", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},

					});
					console.log(response);
					if (response.status == 200) {
						const data = await response.json()
						console.log(data)
						setStore({ user: data });
						return true;
					}
				} catch (error) {
					console.log(error);
					return false;
				}

			},

			traerTodasLasReservas: async () => {
				try {
					const token = localStorage.getItem("access_token");
					const response = await fetch(process.env.BACKEND_URL + "api/users_reservations", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},

					});
					console.log(response);
					if (response.status == 200) {
						const data = await response.json()
						console.log(data)
						return true;
					}
				} catch (error) {
					console.log(error);
					return false;
				}

			},

		}
	};
};


export default getState