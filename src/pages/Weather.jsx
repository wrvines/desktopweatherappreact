import axios from "axios";
import React from "react";
import { FiSunrise, FiSunset } from "react-icons/fi";
import Forecast from "../components/Forecast";

function Weather({ lat, long }) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const baseUrl = import.meta.env.VITE_WEATHER_BASE_URL;

  const [currentWeather, setCurrentWeather] = React.useState("");
  const [forecast, setForecast] = React.useState([]);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!lat || !long) return;
    axios
      .get(
        `${baseUrl}?lat=${lat}&lon=${long}&appid=${apiKey}&exclude=minutely,hourly,alerts&units=imperial`
      )
      .then((res) => {
        setCurrentWeather(res.data.current);
        setForecast(res.data.daily);
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
  let date = unixDate.toLocaleDateString("en-US", options);
  let sunRise = unixSunrise.toLocaleTimeString("en-US", options);
  let sunSet = unixSunset.toLocaleTimeString("en-US", options);

  return (
    <div className="max-w-[1640px] mx-auto h-screen bg-blue-400">
      {success ? (
        <div className="grid">
          <p className="text-[.75rem] flex justify-center">{date}</p>
          <div className="flex flex-col md:flex-row">
            <div className="mx-auto">
              <h1 className="text-[10rem] font-bold flex">
                {Math.round(currentWeather?.temp)}
                <span className="text-[4rem] flex justify items-center">
                  &deg; F
                </span>
              </h1>
            </div>
            <div className="mx-auto flex justify-center items-center p-4">
              <img
                className="w-[8rem] h-[8] md:w-[12rem] md:h-[12rem]"
                src={`https://openweathermap.org/img/wn/${currentWeather?.weather[0]?.icon}@2x.png`}
                alt={currentWeather?.weather[0]?.main}
              />
              <h3 className="text-[3rem] -rotate-[90deg]">
                {currentWeather?.weather[0]?.main}
              </h3>
            </div>
          </div>
          <div className="flex flex-col justify-around items-center md:flex-row p-8 bg-blue-400">
            <div className="p-4">
              <p>Humidity: {Math.round(currentWeather?.humidity)}%</p>
              <p>Wind: {Math.round(currentWeather?.wind_speed)} MPH</p>
              <p>Feels Like: {Math.round(currentWeather?.feels_like)}&deg; F</p>
            </div>
            <div className="p-4">
              <p className="flex">
                <FiSunrise /> : {sunRise}
              </p>
              <p className="flex">
                <FiSunset /> : {sunSet}
              </p>
            </div>
          </div>
          <div className="bg-blue-400 grid md:grid-cols-2 lg:grid-cols-4 w-full">
            {forecast?.map((daily) => (
              <Forecast
                key={daily.dt}
                high={Math.round(daily?.temp?.max)}
                low={Math.round(daily?.temp?.min)}
                wind={Math.round(daily?.wind_speed)}
                conditions={daily?.weather[0]?.main}
                image={daily?.weather[0]?.icon}
                time={daily?.dt}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Weather;
