import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Temperatura from "./components/Tempetura";
import Form from "./components/Form";
import tempPosicion from "./tempPosicion.js";
import traerDatosXCiudad from "./datosXciudad.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NocheLuna from "./img/NocheLuna.svg";
import Nieve from "./img/Nieve.jpg";
import NocheDespajado from "./img/NocheDespejado.svg";
import PaisajeSoleado from "./img/PaisajeSoleado.jpg";
import Soleado from "./img/Soleado.jpg";
import Tormenta from "./img/Tormenta.jpg";

export default function App() {
	const [temperatura, setTemperatura] = useState({
		temperatura: undefined,
		ciudad: undefined,
		pais: undefined,
		humedad: undefined,
		temp_min: undefined,
		temp_max: undefined,
		descripcion: undefined,
	});

	//estado para la localizacion del usuario
	const [loc, setLoc] = useState({
		latitude: undefined,
		longitude: undefined,
	});

	const MySwal = withReactContent(Swal);
	const alerta = (mensaje) => {
		MySwal.fire({
			icon: "error",
			title: "Oops...",
			text: mensaje,
		});
	};


	//funcion para la localizacion que actualizac el estado a la posicion actual
	function mostrarCoordenada(posicion) {
		setLoc({
			latitude: posicion.coords.latitude,
			longitude: posicion.coords.longitude,
		});
	}

	//manejo de errores
	function errores(err) {
		if (err.code === err.TIMEOUT) {
			alerta("Se ha superado el tiempo de espera");
		}
		if (err.code === err.PERMISSION_DENIED) {
			alerta("El usuario no permitió informar su posición");
		}
		if (err.code === err.POSITION_UNAVAILABLE) {
			alerta("El dispositivo no pudo recuperar la posición actual");
		}
	}

	const getUserLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(mostrarCoordenada, errores, {
				enableHighAccuracy: true,
				timeout: 8000,
				maximumAge: 0,
			});
		} else {
			alert("El navegador no dispone la capacidad de geolocalización");
		}
	};

	useEffect(() => {
		getUserLocation();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	console.log(loc);

	useEffect(() => {
		if (loc.latitude !== undefined) {
			tempPosicion(loc)
				.then((data) => {
					setTemperatura({
						temperatura: Math.round(data.main.temp - 273.15),
						ciudad: data.name,
						pais: data.sys.country,
						humedad: data.main.humidity,
						temp_min: Math.round(data.main.temp_min - 273.15),
						temp_max: Math.round(data.main.temp_max - 273.15),
						descripcion: data.weather[0].description,
					});
				})
				.catch((e) => {
					console.log(e);
					alerta("Oops ocurrio un error, intenetelo mas tarde.");
				});
		}
	}, [loc]); // eslint-disable-line react-hooks/exhaustive-deps

	const updateCiudad = (ciudad) => {
		traerDatosXCiudad(ciudad)
			.then((data) => {
				setTemperatura({
					temperatura: Math.round(data.main.temp - 273.15),
					ciudad: data.name,
					pais: data.sys.country,
					humedad: data.main.humidity,
					temp_min: Math.round(data.main.temp_min - 273.15),
					temp_max: Math.round(data.main.temp_max - 273.15),
					descripcion: data.weather[0].description,
				});
			})
			.catch((e) => {
				alerta("ooPs ocurrio un error, pruebe con otra ciudad");
			});
	};

//referencia al contenedor principalpara cambiar la imagen de fondo
	const bgPrincipal = useRef(null);
	//dependiendo de la descripcion de la temperatura
	const setbackground = () => {
		const bgDiv = bgPrincipal.current;
		switch (temperatura.descripcion) {
			case `muy nuboso`:
				bgDiv.style.backgroundImage = `url(${NocheLuna})`;
				break;
			case `nubes` || `cielo claro`:
				bgDiv.style.backgroundImage = `url(${PaisajeSoleado})`;
				break;
			case `nevando` || `nieve`:
				bgDiv.style.backgroundImage = `url(${Nieve})`;
				break;
			case `lluvia ligera` || `lluvia` || `tormenta`:
				bgDiv.style.backgroundImage = `url(${Tormenta})`;
				break;
			case `soleado`:
				bgDiv.style.backgroundImage = `url(${Soleado})`;
				break;
			default:
				bgDiv.style.backgroundImage = `url(${NocheDespajado})`;
		}
	};

	//efecto para caundo se actualize la temperatura
	useEffect(() => {
		setbackground();
	}, [temperatura]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="row">
			<div ref={bgPrincipal} className="col-md-5 contenedor-principal">
				<Form updateCiudad={updateCiudad} />
			</div>
			<div className="col-md-7 contenedor-datos">
				<Temperatura
					temperatura={temperatura.temperatura}
					ciudad={temperatura.ciudad}
					pais={temperatura.pais}
					humedad={temperatura.humedad}
					descripcion={temperatura.descripcion}
					temp_min={temperatura.temp_min}
					temp_max={temperatura.temp_max}
				/>
			</div>
		</div>
	);
}
