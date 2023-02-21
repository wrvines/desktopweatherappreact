import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Weather from "./pages/Weather";
import axios from "axios";

function App() {
  const locationBaseUrl = process.env.REACT_APP_GEOCODE_BASE_URL;
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const baseUrl = process.env.REACT_APP_WEATHER_BASE_URL;
  const geocodeApiKey = process.env.REACT_APP_GEOCODE_API_KEY;

  //   https://api.geoapify.com/v1/geocode/search?text=casper&apiKey=e383ad4fdfc84f31a6a4ac17d6c3ab7d

  const [location, setLocation] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [long, setLong] = React.useState("");
  const [city, setCity] = React.useState("");

  const handleLocation = (e) => {
    e.preventDefault();
    axios
      .get(`${locationBaseUrl}?text=${location}&apiKey=${geocodeApiKey}`)
      .then((res) => {
        console.log(res.data.query.parsed);
        setLat(res.data.features[0].properties.lat);
        setLong(res.data.features[0].properties.lon);
        setCity(res.data.query.parsed.city);
      })
      .catch((err) => console.log(err));
    setLocation("");
  };

  return (
    <div className="bg-blue-400 h-screen">
      <div>
        <form
          onSubmit={handleLocation}
          className="flex justify-center items-center py-8"
        >
          <input
            className="h-[4rem] w-[15rem] text-4xl text-center rounded-xl shadow-lg bg-blue-100 "
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter City"
            value={location}
          />
        </form>
      </div>
      <h1 className="text-4xl font-bold text-center pb-4">
        {city.toUpperCase()}
      </h1>
      <Weather lat={lat} long={long} />
    </div>
  );
}

export default App;
