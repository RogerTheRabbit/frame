import { useEffect, useState } from "react";
import WeatherDay, { type Forecast } from "./weather-day";

export default function Weather() {
  const [weather, setWeather] = useState<any>([]);

  const fetchWeather = async () => {
    const resp = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${import.meta.env.VITE_WEATHER_LOCATION}&days=3&aqi=no&alerts=yes`,
    );
    const data = await resp.json();
    setWeather(data);
  };

  useEffect(() => {
    fetchWeather();

    let interval = setInterval(async () => {
      fetchWeather();
    }, 900000);

    return () => {
      interval;
    };
  }, []);

  const forecastMaxTemp = weather?.forecast?.forecastday?.reduce(
    (accumulator: number, currentValue: any) =>
      Math.max(accumulator, currentValue?.day?.maxtemp_c),
    -10000,
  );
  const forecastMinTemp = weather?.forecast?.forecastday?.reduce(
    (accumulator: number, currentValue: any) =>
      Math.min(accumulator, currentValue?.day?.mintemp_c),
    10000,
  );

  return (
    <div>
      <div className="flex">
        {weather?.forecast?.forecastday?.map((forecast: Forecast) => (
          <WeatherDay
            key={forecast.date}
            forecast={forecast}
            forecastMaxTemp={forecastMaxTemp}
            forecastMinTemp={forecastMinTemp}
          />
        ))}
      </div>
    </div>
  );
}
