import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
}[]
};

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
      description: string;
  }}};


function App() {
  const API_KEY = process.env.REACT_APP_API_KEY; // Get API key from .env file

  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    name: "",
    main: {
      temp: 0,
      humidity: 0,
      pressure: 0,
      windSpeed: 0,
      temp_min: 0,
      temp_max: 0,
    },
    weather: [],
  });
const [forecastData, setForecastData] = useState<ForecastData>({
  list: {
    dt_txt: "",
    main: {
      temp: 0,
    },
    weather: {
      icon: "",
      description: "",
    },
}});

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(weatherURL);
      const data = await response.json();
      setWeatherData(data);
      console.log("Weather Data:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(forecastURL);
      const data = await response.json();
      setForecastData(data);
      console.log("Forecast Data:", data);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  useEffect(() => {
    if (location && weatherData.name === "") {
      fetchWeatherData();
      fetchForecastData();
    }
  }, [location, weatherData.name, weatherURL]);

  const handleButtonClick = () => {
    fetchWeatherData();
    fetchForecastData();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchWeatherData();
      fetchForecastData();
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleButtonClick}>Search</button>
      </div>
      <div className="weather-container">
        {weatherData.name && <h2>{weatherData.name}</h2>}
        {weatherData.main && <p>Temperature: {weatherData.main.temp}</p>}
        {weatherData.main && <p>Humidity: {weatherData.main.humidity}</p>}  
        {weatherData.main && <p>Pressure: {weatherData.main.pressure}</p>}
        {weatherData.main && <p>Wind Speed: {weatherData.main.windSpeed}</p>}
        {weatherData.main && <p>Description: {weatherData.weather[0].main}</p>}
        {weatherData.main && <p>Min Temp: {weatherData.main.temp_min}</p>}
        {weatherData.main && <p>Max Temp: {weatherData.main.temp_max}</p>}
      </div>
      {/* <div className="forecast-container">
        {forecastData.list && <p>Forecast: {forecastData.list.dt_txt}</p>}
        {forecastData.list && <p>Temperature: {forecastData.list.main.temp}</p>}
        {forecastData.list && <p>Icon: {forecastData.list.weather.icon}</p>}
        {forecastData.list && <p>Description: {forecastData.list.weather.description}</p>}
      </div> */}
    </div>
  );
}

export default App;
