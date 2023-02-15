import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Weather from "./pages/Weather";
import axios from "axios";

function App() {
	const locationBaseUrl = process.env.REACT_APP_GEOCODE_BASE_URL;
	const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
	const baseUrl = process.env.REACT_APP_WEATHER_BASE_URL;

	const [location, setLocation] = React.useState("");
	const [lat, setLat] = React.useState("");
	const [long, setLong] = React.useState("");

	const handleLocation = (e) => {
		e.preventDefault();
		axios
			.get(`${locationBaseUrl}?q=${location}&appid=${apiKey}`)
			.then((res) => {
				console.log(res.data);
				setLat(res.data[0].lat);
				setLong(res.data[0].lon);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="bg-blue-400 h-screen">
			<div>
				<form
					onSubmit={handleLocation}
					className="flex justify-center items-center py-8">
					<input
						className="h-[4rem] w-[15rem] text-4xl text-center rounded-xl shadow-lg bg-blue-300"
						type="text"
						onChange={(e) => setLocation(e.target.value)}
						placeholder="Enter City"
						value={location}
					/>
				</form>
			</div>
			<Weather lat={lat} long={long} />
		</div>
	);
}

export default App;
