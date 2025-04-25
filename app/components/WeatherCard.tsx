'use client';

import { useState } from 'react';
import axios from 'axios';
import { Sun, Wind, Thermometer, AlertTriangle } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
}

const WeatherCard = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('City is required.');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/weather`, {
        params: { city, country },
      });
      setWeatherData(response.data);
    } catch (err: any) {
      console.error('❌ Error fetching weather:', err);
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">☁️ Check Weather</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Country Code (optional)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchWeather}
          className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-4 py-2 rounded-lg font-medium"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>

        {error && (
          <div className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {weatherData && (
          <div className="bg-white/10 p-4 rounded-lg mt-4 border border-white/20">
            <h3 className="text-xl font-bold mb-2">{weatherData.location}</h3>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Thermometer className="w-4 h-4" />
              Temperature: {weatherData.temperature} °C
            </div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Wind className="w-4 h-4" />
              Wind Speed: {weatherData.windspeed} km/h
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sun className="w-4 h-4" />
              Weather Code: {weatherData.weathercode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
