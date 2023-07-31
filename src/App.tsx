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
    description: string;
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
  const [searchPerformed, setSearchPerformed] = useState(false); 
  const [isExpanded, setIsExpanded] = useState(false); 
  const [loading, setLoading] = useState(false);
  
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(weatherURL);
      const data = await response.json();
      setWeatherData(data);
      console.log("Weather Data:", data);
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
    if (location && weatherData.name === "" && searchPerformed) {
      setLoading(true);
      fetchWeatherData();
      fetchForecastData();
    }
  }, [location, weatherData.name, weatherURL, searchPerformed]);

  const handleButtonClick = () => {
    fetchWeatherData();
    fetchForecastData();
    setSearchPerformed(true);
    setLoading(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchWeatherData();
      fetchForecastData();
    }
  };

  const handleDetailsClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (

    <div className="main-container">
      <h1>Weather App</h1>

      <div className="search-container">

        <input
          type="text"
          placeholder="Enter a City..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className='search-btn' onClick={handleButtonClick}>Search</button>

      </div>

{searchPerformed && (
<div>

<div className="weather-container">

      <div className="weather-details">
          {weatherData.weather?.[0]?.icon && (
            <img
              className="weather-icon"
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
          )}
          {weatherData.name && (
            <h2 className="city">{weatherData.name}, {weatherData.sys.country}</h2>
          )}
        </div>

        {weatherData.main && <p className='main-temp'>{weatherData.main.temp}°C</p>}
        {Array.isArray(weatherData.weather) && weatherData.weather.length > 0 && ( <p className='description'>{weatherData.weather[0].main}</p>)}
        
        <div className='minmax'>
            {weatherData.main && <p className='details'>H: {Math.round(weatherData.main.temp_max)}°C</p>}
            {weatherData.main && <p className='details'>L: {Math.round(weatherData.main.temp_min)}°C</p>}
        </div>

        <button className='details-btn' onClick={handleDetailsClick}>
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>

        {isExpanded && (
        <div className='hidden-details-container'>

        <div className='hidden-details'>
          {<p className='hidden-title'>Feels Like</p>}
          {weatherData.main && <img className="hidden-icon" src={`/icons/feelsliketemp.png`} alt={'feelslike'}/>}
          {weatherData.main && <p className='hidden-info'>{weatherData.main.feels_like}°C</p>}
        </div>

        <div className='hidden-details'>
          {<p className='hidden-title'>Wind Speed</p>}
          {weatherData.main && <img className="hidden-icon" src={`/icons/windspeed.png`} alt={'wind'}/>}
          {weatherData.wind && <p className='hidden-info'>{weatherData.wind.speed} m/s</p>}
        </div>
          
          <div className='hidden-details'>
            {<p className='hidden-title'>Humidity</p>}
            {weatherData.main && <img className="hidden-icon" src={`/icons/humidity.png`} alt={'humidity'}/>}
            {weatherData.main && <p className='hidden-info'>{weatherData.main.humidity}%</p>}  
          </div>

          <div className='hidden-details'>
            {<p className='hidden-title'>Pressure</p>}
            {weatherData.main && <img className="hidden-icon" src={`/icons/pressure.png`} alt={'pressure'}/>}
            {weatherData.main && <p className='hidden-info'>{weatherData.main.pressure} hPa</p>}
          </div>
          
        </div>
        )}

      </div>

       <div className="forecast-container">

        {forecastData.list?.slice(1, 6).map((forecast, index) => (
          <div className='day' key={index}>
            <p className='time'>{new Intl.DateTimeFormat(undefined, {
              hour: 'numeric',
              minute: 'numeric',
              hour12: false
            }).format(new Date(forecast.dt_txt))}</p>
            <p>{forecast.weather?.[0]?.icon && (<img
              className="forecast-icon"
              src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
              alt={forecast.weather[0].description}
            />
            )}</p>
            <p className='temp'>{Math.round(forecast.main.temp)}°C</p>
          </div>
        ))}

      </div>     


</div>
)}
      
    </div>
  
);

}

export default App;
