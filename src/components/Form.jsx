import React, { useState } from "react";
import estilos from "./estilos.form.css";

export default function Form({ updateCiudad }) {
	const [ciudad, setCiudad] = useState("");
	const [validacion, setValidacion] = useState(true);

	const handleChange = (e) => {
		setCiudad({ [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (ciudad && ciudad.ciudad !== "") {
			setValidacion(true);
			updateCiudad(ciudad);
		} else {
			setValidacion(false);
		}
	};

	return (
		<div>
			<h1 className={estilos.contenedor_titulo}>Clima</h1>
			<h4 className={estilos.contenedor__subitulo}>
				Busca Una Ciudad para visualizar su temperatura
			</h4>
			<form onSubmit={handleSubmit}>
				<input
					onChange={handleChange}
					type="text"
					name="ciudad"
					placeholder="Ciudad..."
				></input>
				<button>Buscar</button>
			</form>
			{validacion ? (
				<></>
			) : (
				<div className="alert alert-danger">
					Necesita escribir algo para buscar
				</div>
			)}
		</div>
	);
}
