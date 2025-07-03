import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import fetch from 'node-fetch'; 

function convertDegreeToDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

export const reportController = {
  
  async index(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Editing report ${reportId} from station ${stationId}`);
    
    const viewData = {
      title: "Edit Report",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getReportById(reportId),
    };
    
    response.render("report-view", viewData);
  },
  
  async update(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    
    const updatedReport = {
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: request.body.windDirection, 
      pressure: Number(request.body.pressure),
    };
    
    console.log(`Updating report ${reportId} from station ${stationId}`);
    await reportStore.updateReport(reportId, updatedReport);
    
    response.redirect("/station/" + stationId);
  },
  
  async fetchLiveData(request, response) {
    try {
      const stationId = request.params.stationid;
      console.log('Fetching live data for station:', stationId);
      
      const station = await stationStore.getStationById(stationId);
      if (!station) {
        return response.status(404).send("Station not found");
      }
      
      console.log('Station info:', station);
      
      const apiKey = 'af52a9802a4c633460b714fc47b6fb91';
      
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${station.latitude}&lon=${station.longitude}&units=metric&appid=${apiKey}`;
      
      console.log('Calling OpenWeather API:', apiUrl);
      
      const apiResponse = await fetch(apiUrl);
      if (!apiResponse.ok) {
        console.error('OpenWeather API response status:', apiResponse.status);
        throw new Error('Failed to fetch data from OpenWeather');
      }
      
      const weatherData = await apiResponse.json();
      console.log('OpenWeather response:', weatherData);
      
      const liveReport = {
        code: weatherData.weather[0].id,
        iconCode: weatherData.weather[0].icon,
        description: weatherData.weather[0].description,
        temperature: weatherData.main.temp,
        windSpeed: (weatherData.wind.speed * 3.6).toFixed(2),
        windDirection: convertDegreeToDirection(weatherData.wind.deg),
        pressure: weatherData.main.pressure,
        date: new Date().toISOString(),
      };
      
      await reportStore.addReport(stationId, liveReport);
      
      response.json(liveReport);
    } catch (error) {
      console.error('Error in fetchLiveData:', error);
      response.status(500).send('Error fetching live weather data');
    }
  }

};
