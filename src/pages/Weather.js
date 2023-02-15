import axios from "axios";
import React from "react";

function Weather({ lat, long }) {
	const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
	const baseUrl = process.env.REACT_APP_WEATHER_BASE_URL;

	const [currentWeather, setCurrentWeather] = React.useState("");
	const [success, setSuccess] = React.useState(false);

	React.useEffect(() => {
		axios
			.get(
				`${baseUrl}?lat=${lat}&lon=${long}&appid=${apiKey}&exclude=minutely,hourly,alerts&units=imperial`
			)
			.then((res) => {
				console.log(res.data);
				setCurrentWeather(res.data.current);
				setSuccess(true);
			})
			.catch((err) => console.log(err.data));
	}, [lat, long]);
	return (
		<div>
			{success ? (
				<div>
					<div className="flex justify-around">
						<h1 className="text-[10rem]">{currentWeather?.temp}</h1>
						<img
							className="w-[16rem] h-[16rem]"
							src={`http://openweathermap.org/img/wn/${currentWeather?.weather[0]?.icon}@2x.png`}
							alt="/"
						/>
					</div>
					<h3 className="text-[4rem]">
						{currentWeather?.weather[0]?.main}
					</h3>
					<p>Humidity: {currentWeather?.humidity}</p>
					<p>Wind: {currentWeather?.wind_speed}</p>
				</div>
			) : null}
		</div>
	);
}

export default Weather;
