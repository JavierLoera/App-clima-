import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Temperatura from "./components/Tempetura";
import Form from "./components/Form";
import tempPosicion from "./tempPosicion.js";
import traerDatosXCiudad from "./datosXciudad.js";
import useGeolocation from 'react-hook-geolocation'
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
const [loc,setLoc]=useState({
latitude:"",
longitude:""
})


const getUserLocation=()=>{
  if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(mostrarCoordenada,errores,{timeout:50,maximumAge:60000});
        } else {
            alert('El navegador no dispone la capacidad de geolocalización');
        }
}

function mostrarCoordenada(posicion) {
        setLoc({
   latitude:posicion.coords.latitude,
longitude:posicion.coords.kongitude
     }) 
    }

function errores(err) {
    if (err.code == err.TIMEOUT) 
        alert("Se ha superado el tiempo de espera");
    if (err.code == err.PERMISSION_DENIED)     
        alert("El usuario no permitió informar su posición");
    if (err.code == err.POSITION_UNAVAILABLE)                 
        alert("El dispositivo no pudo recuperar la posición actual");
    }

useEffect(()=>{
getUserLocation()
},[])

	const MySwal = withReactContent(Swal);

	const alerta = (mensaje) => {
		MySwal.fire({
			icon: "error",
			title: "Oops...",
			text: mensaje,
		});
	};

	const bgPrincipal = useRef(null);

	useEffect(() => {
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
					alert(e)
					alerta();
				});
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
				alert(e)
				alerta();
			});
	};

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
