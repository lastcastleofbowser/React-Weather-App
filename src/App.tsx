import React, { useState } from 'react';
import './App.css';
import { useErrorBoundary } from "react-error-boundary";

function App() {
  
     
      const API_KEY = process.env.API_KEY;
  
      const [location, setLocation] = useState(""); //can also include country code ie {city name},{country code}
      const [description, setDescription] = useState("");
      const [temperature, setTemperature] = useState(0);
      const [humidity, setHumidity] = useState(0);
      const [windSpeed, setWindSpeed] = useState(0);
      const [windDirection, setWindDirection] = useState(0);
      const [pressure, setPressure] = useState(0);

      const [weather, setWeather] = useState({});
      const [forecast, setForecast] = useState([]);
  
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=&${location}&appid=${API_KEY}`;
      
      console.log('Location: ', location);
    
  return (
    <div className="App">
      <div className="search-container">
        <input 
          type="text"
          placeholder="Search..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button>Search</button>
      </div>
    </div>
  );
}

export default App;
