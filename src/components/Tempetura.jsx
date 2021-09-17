import React from "react";

const Temperatura = ({
	temperatura,
	ciudad,
	pais,
	humedad,
	descripcion,
	temp_min,
	temp_max,
}) => (
	<>
		<div className="contenedor_datos__info">
			<p className="datos__titulo">
				Localizacion:
				<span className="datos__valor">
					{ciudad},{pais}
				</span>
			</p>
			<p className="datos__titulo">
				Temperatura:
				<span className="datos__valor"> {temperatura}°C</span>
			</p>
			<p className="datos__titulo">
				Humedad:
				<span className="datos__valor"> {humedad}%</span>
			</p>
			<p className="datos__titulo">
				Condiciones:
				<span className="datos__valor"> {descripcion}</span>
			</p>
			<p className="datos__titulo">
				Temperatura Minima:
				<span className="datos__valor"> {temp_min}°C</span>
			</p>
			<p className="datos__titulo">
				Temperatura Maxima:
				<span className="datos__valor"> {temp_max}°C</span>
			</p>
		</div>
	</>
);

export default Temperatura;
