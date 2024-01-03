import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import './App.css';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [searchInput, setSearchInput] = useState('');

  const success = (pos) => {
    const obj = {
      lat: pos.coords.latitude,
      long: pos.coords.longitude,
    };
    setCoords(obj);
  };

  const handleSearch = () => {
    if (searchInput) {
      const API_KEY = '0f5cb6681c1ed90da9aa42546d0268cb';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}`;

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);

          const temperature = {
            celsius: (res.data.main.temp - 273.15).toFixed(1),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(1),
          };

          setTemp(temperature);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords || searchInput) {
      const API_KEY = '0f5cb6681c1ed90da9aa42546d0268cb';
      let url;

      if (searchInput) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}`;
      } else {
        const { lat, long } = coords;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;
      }

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);

          // Obtener la diferencia de tiempo en segundos y ajustar la temperatura
          const timezoneOffsetInSeconds = res.data.timezone;
          const localTime = new Date().getTime() / 1000 + timezoneOffsetInSeconds;
          
          const temperature = {
            celsius: (res.data.main.temp - 273.15).toFixed(1),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(1),
            localTime: new Date(localTime * 1000).toLocaleTimeString(),
          };

          setTemp(temperature);
        })
        .catch((err) => console.log(err));
    }
  }, [coords, searchInput]);

  return (
    <WeatherCard
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      handleSearch={handleSearch}
      weather={weather}
      temp={temp}
    />
  );
}

export default App;
