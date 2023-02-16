import axios from "axios";
import React from "react";
import { FiSunrise, FiSunset } from "react-icons/fi";

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
	const currentTime = currentWeather?.dt;

	const unixDate = new Date(currentTime * 1000);
	const unixSunrise = new Date(currentWeather?.sunrise * 1000);
	const unixSunset = new Date(currentWeather?.sunset * 1000);
	let options = {
		day: "numeric",
		month: "long",
		hour: "numeric",
		minute: "numeric",
	};
	let optionsTwo = { hour: "numeric", minute: "numeric" };
	let optionsThree = { hour: "numeric", minute: "numeric" };
	let date = unixDate.toLocaleDateString("en-US", options);
	let sunRise = unixSunrise.toLocaleTimeString("en-US", options);
	let sunSet = unixSunset.toLocaleDateString("en-US", options);

	return (
		<div>
			{success ? (
				<div className="max-w-lg h-screen w-full">
					<div className="grid gap-[2rem] w-full ">
						<div className="mx-auto">
							<h1 className="text-[10rem] font-bold flex ">
								{Math.round(currentWeather?.temp)}
								<span className="text-[4rem] flex justify items-center">
									&deg; F
								</span>
							</h1>
							<p>{date}</p>
						</div>
						<div className="flex items-center mx-auto md:ml-16">
							<img
								className="w-[8rem] h-[8] md:w-[12rem] md:h-[12rem]"
								src={`http://openweathermap.org/img/wn/${currentWeather?.weather[0]?.icon}@2x.png`}
								alt="/"
							/>
							<h3 className="text-[3rem] -rotate-[90deg] ">
								{currentWeather?.weather[0]?.main}
							</h3>
						</div>

						<div className="px-8 mt-8 mx-auto">
							<p>
								Humidity: {Math.round(currentWeather?.humidity)}
								%
							</p>
							<p>
								Wind: {Math.round(currentWeather?.wind_speed)}{" "}
								MPH
							</p>
							<p>
								Feels Like:{" "}
								{Math.round(currentWeather?.feels_like)}&deg;F
							</p>
						</div>
						<div className="mx-auto">
							<p className="flex">
								<FiSunrise />: {sunRise}
							</p>
							<p className="flex">
								<FiSunset />: {sunSet}
							</p>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default Weather;
