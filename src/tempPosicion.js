const tempPosicion = async (loc) => {
	const { latitude, longitude } = loc;
	const API_KEY = "b189ddc5a38fca7f7e76afb8a2ea7919";
	const res = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&lang=es`
	);
	const data = await res.json();
	return data;
};
export default tempPosicion;
