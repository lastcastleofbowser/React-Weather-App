import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: {
    feels_like: number;
    temp: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  sys: {
    country: string;
  };
  weather: {
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
      description: string;
  }[] | null
  }[]
};


function App() {
  const API_KEY = process.env.REACT_APP_API_KEY; // Get API key from .env file

  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData>({
    name: "",
    main: {
      feels_like: 0,
      temp: 0,
      humidity: 0,
      pressure: 0,
      temp_min: 0,
      temp_max: 0,
    },
    sys: {
      country: "",
    },
    weather: [],
    wind: {
      speed: 0,
    },
  });

  const [forecastData, setForecastData] = useState<ForecastData>({ list: [] });



  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;
  const [searchPerformed, setSearchPerformed] = useState(false); // tracks if a search has been performed

  
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(weatherURL);
      const data = await response.json();
      setWeatherData(data);
      // console.log("Weather Data:", data);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(forecastURL);
      const data = await response.json();
      setForecastData(data);
      // console.log("Forecast Data:", data);
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

    <div className="app-container">
      <h1>Weather App</h1>

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

{searchPerformed && (
<div>

<div className="weather-container">

        {weatherData.name && <h2>{weatherData.name}, {weatherData.sys.country}</h2>}
        {weatherData.main && <p>Temperature: {weatherData.main.temp}°C</p>}
        {weatherData.main && <p>Feels Like: {weatherData.main.feels_like}°C</p>}
        {weatherData.wind && <p>Wind Speed: {weatherData.wind.speed} m/s</p>}
        {weatherData.main && <p>Humidity: {weatherData.main.humidity}%</p>}  
        {weatherData.main && <p>Pressure: {weatherData.main.pressure} hPa</p>}
        {Array.isArray(weatherData.weather) && weatherData.weather.length > 0 && ( <p>Description: {weatherData.weather[0].main}</p>)}
        {weatherData.main && <p>Min Temp: {weatherData.main.temp_min}°C</p>}
        {weatherData.main && <p>Max Temp: {weatherData.main.temp_max}°C</p>}

      </div>

       <div className="forecast-container">

        {forecastData.list?.slice(0, 5).map((forecast, index) => (
          <div className='day' key={index}>
            <p className='time'>{new Intl.DateTimeFormat(undefined, {
              hour: 'numeric',
              minute: 'numeric',
              hour12: false
            }).format(new Date(forecast.dt_txt))}</p>
            <p>{forecast.weather?.[0]?.icon && (<img
              className="weatherIcon"
              src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
              alt={forecast.weather[0].description}
            />
            )}</p>
            <p className='temp'>{forecast.main.temp}°C</p>
          </div>
        ))}

      </div>     


</div>
)}
      
    </div>
  
);

}

export default App;
