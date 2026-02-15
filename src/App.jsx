import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useEffect, useState } from "react";

function App() {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [defaultCitiesWeather, setDefaultCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultCities = ["Addis Ababa", "Shashemene", "Hawassa", "Bahir Dar", "Gondar", "Dire Dawa", "Mekele", "Harar"];

  // 🔹 Fetch weather for default cities on page load
  useEffect(() => {
    const fetchDefaultCities = async () => {
      try {
        const requests = defaultCities.map((city) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
          ).then((res) => res.json())
        );

        const results = await Promise.all(requests);
        setDefaultCitiesWeather(results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDefaultCities();
  }, []);

  // 🔹 Fetch weather by search
  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setError("");
    setWeather(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🌤 Weather Dashboard
      </h1>

      {/* 🔹 Default Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {defaultCitiesWeather.map((cityWeather, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md text-center transform transition hover:scale-105"
          >
            <h2 className="font-semibold">{cityWeather.name}</h2>
            <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`}
              alt=""
            />
            <p>{cityWeather.main.temp} °C</p>
            <p className="text-sm text-gray-500">
              {cityWeather.weather[0].description}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Search Section */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />
          <button
            onClick={getWeather}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {weather && (
          <div className="text-center mt-4 animate-fade-in">
            <h2 className="text-xl font-semibold">{weather.name}</h2>
            <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=""
            />
            <p>🌡 {weather.main.temp} °C</p>
            <p>💧 {weather.main.humidity}%</p>
            <p>🌬 {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

