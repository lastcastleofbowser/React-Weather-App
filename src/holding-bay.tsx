import React, { useState, useEffect } from 'react';
import './App.css';
//import { useErrorBoundary } from "react-error-boundary";

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
  
      const API_KEY = process.env.REACT_APP_API_KEY;
  
      const [location, setLocation] = useState(""); //can also include country code ie {city name},{country code}
      // const [description, setDescription] = useState("");
      // const [temperature, setTemperature] = useState(0);
      // const [humidity, setHumidity] = useState(0);
      // const [windSpeed, setWindSpeed] = useState(0);
      // const [windDirection, setWindDirection] = useState(0);
      // const [pressure, setPressure] = useState(0);

      const [data, setData] = useState<WeatherData>(
        {name: "", 
        main: {description: "", 
        temp: 0, 
        humidity: 0, 
        pressure: 0, 
        windSpeed: 0
      }});

      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`;
      
      useEffect(()=> {
        async function fetchWeatherData(){
            const response = await fetch(weatherURL);
            const data = await response.json();
            setData(data); 
            console.log(data);    
          }
    fetchWeatherData();
  },[location]);
    
  return (
    <div className="App">
      <div className="search-container">
        <input 
          type="text"
          placeholder="Search..."
          value={location}
          onChange={(e) => {
            console.log(e.target.value); // Check the value in the console
            setLocation(e.target.value);
          }}
        />
        <button>Search</button>
      </div>
      <div className="weather-container">
      {data.name && <h2>{data.name}</h2>}
      {data.main && <p>Temperature: {data.main.temp}</p>}
      </div>
    </div>
  );
}

export default App;
