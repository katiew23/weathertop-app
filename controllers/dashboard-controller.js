import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";
import axios from "axios";

const apiKey = "af52a9802a4c633460b714fc47b6fb91";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    console.log("Logged in user:", loggedInUser);

    let stations = await stationStore.getStationsByUserId(loggedInUser._id);
    stations.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

    const stationsWithLatestReport = await Promise.all(stations.map(async (station) => {
      const reports = await reportStore.getReportsByStationId(station._id);
      const latestReport = reports.length ? reports[reports.length - 1] : null;
      return {
        ...station,
        latestReport,
      };
    }));

    const viewData = {
      title: "WeatherTop Dashboard",
      stations: stationsWithLatestReport,
      user: loggedInUser,
    };

    console.log("Dashboard rendering");
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      title: request.body.title,
      location: request.body.location,
      longitude: Number(request.body.longitude),
      latitude: Number(request.body.latitude),
      userid: loggedInUser._id,
    };
    console.log(`Adding station: ${newStation.title}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting station: ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },

 async addReport(request, response) {
  try {
    const stationId = request.body.stationId;
    if (!stationId) {
      return response.status(400).send("Station ID is required");
    }

    const station = await stationStore.getStationById(stationId);
    if (!station) {
      return response.status(404).send("Station not found");
    }

    const { latitude, longitude } = station;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return response.status(400).send("Station latitude and longitude must be valid numbers");
    }

    // Fetch current weather (for saving)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const currentResult = await axios.get(currentWeatherUrl);

    if (currentResult.status !== 200) {
      return response.status(500).send("Failed to fetch current weather data");
    }

    const currentWeather = currentResult.data;
    const report = {
      code: currentWeather.weather[0].id,
      description: currentWeather.weather[0].description,
      iconCode: currentWeather.weather[0].icon,
      temperature: currentWeather.main.temp,
      windSpeed: currentWeather.wind.speed,
      windDirection: currentWeather.wind.deg,
      pressure: currentWeather.main.pressure,
      date: new Date().toISOString(),
    };

    await reportStore.addReport(stationId, report);
    console.log(`Added new report for station: ${station.title}`);

    // Fetch forecast trends (for charts)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const forecastResult = await axios.get(forecastUrl);

    let tempTrend = [];
    let trendLabels = [];

    if (forecastResult.status === 200) {
      const forecasts = forecastResult.data.list;
      // Get first 10 forecast points (adjust if you want more/less)
      for (let i = 0; i < 10 && i < forecasts.length; i++) {
        tempTrend.push(forecasts[i].main.temp);
        trendLabels.push(forecasts[i].dt_txt);
      }
    }

    const viewData = {
      title: "Weather Report",
      station,
      report,
      tempTrend,
      trendLabels,
    };

    response.render("dashboard-view", viewData);

  } catch (error) {
    console.error("Error adding report:", error);
    response.status(500).send("Internal server error");
  }
}

};
