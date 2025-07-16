import axios from 'axios';

const apiKey = "af52a9802a4c633460b714fc47b6fb91";

export async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const { data } = await axios.get(url);

    if (data.weather && data.weather.length > 0) {
      const weather = data.weather[0];
      return {
        code: weather.id,
        description: weather.description,
        iconCode: weather.icon,
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
      };
    }
    throw new Error("No weather data");
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}


