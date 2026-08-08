import React from "react";
import axios from "axios";
import Weather from "./pages/Weather";

function App() {
  const locationBaseUrl = import.meta.env.VITE_GEOCODE_BASE_URL;
  const geocodeApiKey = import.meta.env.VITE_GEOCODE_API_KEY;

  const [location, setLocation] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [long, setLong] = React.useState("");
  const [city, setCity] = React.useState("");

  const handleLocation = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    axios
      .get(`${locationBaseUrl}?text=${location}&apiKey=${geocodeApiKey}`)
      .then((res) => {
        setLat(res.data.features[0].properties.lat);
        setLong(res.data.features[0].properties.lon);
        setCity(res.data.query?.parsed?.city ?? location.trim());
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
        {city ? city.toUpperCase() : ""}
      </h1>
      <Weather lat={lat} long={long} />
    </div>
  );
}

export default App;
