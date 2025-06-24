import fetch from "node-fetch";

const apiKey = "YOUR_API_KEY";

export async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.weather && data.weather.length > 0) {
      const weather = data.weather[0];
      return {
        code: weather.id,
        description: weather.description,
        iconCode: weather.icon,  // e.g. "10d"
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


