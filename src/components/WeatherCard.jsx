import React, { useState, useEffect } from 'react';
import './WeatherCard.css';

const WeatherCard = ({ searchInput, setSearchInput, handleSearch, weather, temp }) => {
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    setWeatherIcon(weather?.weather[0]?.icon);
  }, [weather]);

  useEffect(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    setIsDay(currentHour >= 6 && currentHour < 18);
  }, []);

  useEffect(() => {
    const sunrise = weather?.sys.sunrise;
    const sunset = weather?.sys.sunset;

    if (sunrise && sunset) {
      const currentTimestamp = new Date().getTime() / 1000;
      setIsDay(currentTimestamp > sunrise && currentTimestamp < sunset);
    }
  }, [weather]);

  useEffect(() => {
    setBackgroundClass(getBackgroundClass());
  }, [temperatureUnit, isDay, weatherIcon, temp]);

  const getBackgroundClass = () => {
    const temperatureValue = temperatureUnit === 'celsius' ? temp?.celsius : temp?.fahrenheit;

    if (temperatureValue >= 25 && temperatureValue <= 35) {
      return isDay ? 'soleado-background-day' : 'soleado-background-night';
    } else if (temperatureValue >= 0 && temperatureValue <= 20) {
      return isDay ? 'nublado-background-day' : 'nublado-background-night';
    } else if (temperatureValue >= 20 && temperatureValue <= 25) {
      return isDay ? 'lluvioso-background-day' : 'lluvioso-background-night';
    } else if (temperatureValue >= 0 && temperatureValue <= -10) {
      return isDay ? 'nevado-background-day' : 'nevado-background-night';
    } else if (temperatureValue >= 35 && temperatureValue <= 50) {
      return isDay ? 'calido-background-day' : 'calido-background-night';
    } else {
      return isDay ? 'tiempo-background-day' : 'tiempo-background-night';
    }
  };

  const getTemperature = () => {
    return temperatureUnit === 'celsius' ? `${temp?.celsius} °C` : `${temp?.fahrenheit} °F`;
  };

  return (
    <div className={`weather-card-container ${backgroundClass}`}>
      <article className="weather-card">
        <h1 className="weather-title">Weather app</h1>
        <h2 className="location">{weather?.name}, {weather?.sys.country}</h2>
        <section className="weather-info">
          <header>
            {weatherIcon && (
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weatherIcon}.png`}
                alt=""
              />
            )}
          </header>
          <article>
            <h3 className="weather-description">{weather?.weather[0].description}</h3>
            <ul className="weather-details">
              <li>
                <span className="detail-name">Wind Speed</span>
                <span className="detail-value">{weather?.wind.speed}m/s</span>
              </li>
              <li>
                <span className="detail-name">Clouds</span>
                <span className="detail-value">{weather?.clouds.all}%</span>
              </li>
              <li>
                <span className="detail-name">Pressure</span>
                <span className="detail-value">{weather?.main.pressure}hPa</span>
              </li>
            </ul>
          </article>
        </section>
        <footer className="temperature-footer">
          <div className="weather-card-footer">
            <h2 className="temperature">{getTemperature()}</h2>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter city name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>
          <button className="temperature-button" onClick={() => setTemperatureUnit((prevUnit) => (prevUnit === 'celsius' ? 'fahrenheit' : 'celsius'))}>
            Change Temperature
          </button>
        </footer>
      </article>
    </div>
  );
};

export default WeatherCard;
