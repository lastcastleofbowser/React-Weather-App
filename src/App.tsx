import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: {
    description: string;
    temp: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
  };
}

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY; // Get API key from .env file
  const [location, setLocation] = useState("");
  const [data, setData] = useState<WeatherData>({
    name: "",
    main: {
      description: "",
      temp: 0,
      humidity: 0,
      pressure: 0,
      windSpeed: 0,
    },
  });

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(weatherURL);
      const data = await response.json();
      setData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (location && data.name === "") {
      fetchWeatherData();
    }
  }, [location, data.name, weatherURL]);

  const handleButtonClick = () => {
    fetchWeatherData();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchWeatherData();
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
          onKeyPress={handleKeyPress} // Call handleKeyPress when Enter is pressed
        />
        <button onClick={handleButtonClick}>Search</button>
      </div>
      <div className="weather-container">
        {data.name && <h2>{data.name}</h2>}
        {data.main && <p>Temperature: {data.main.temp}</p>}
      </div>
    </div>
  );
}

export default App;
