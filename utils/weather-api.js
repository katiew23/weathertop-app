import axios from "axios";

const apiKey = "af52a9802a4c633460b714fc47b6fb91";

export async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather`;
  
  try {
    const { data } = await axios.get(url, {
      params: { q: city, appid: apiKey, units: "metric" }
    });

    if (data.weather && data.weather.length > 0) {
      return {
        code: data.weather[0].id,
        temperature: data.main.temp,
        windSpeed: data.wind.speed * 3.6,  //m/s → km/h
        pressure: data.main.pressure
      };
    }

    throw new Error("No weather data");
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}
//https://axios-http.com/docs/intro
//https://www.freecodecamp.org/news/how-to-use-axios-with-react/

