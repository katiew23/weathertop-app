import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

// Add this at the top — map codes to description and icon
const weatherCodeMap = {
  200: { description: "Thunderstorm with light rain", iconCode: "11d" },
  300: { description: "Drizzle", iconCode: "09d" },
  500: { description: "Light rain", iconCode: "10d" },
  600: { description: "Light snow", iconCode: "13d" },
  701: { description: "Mist", iconCode: "50d" },
  800: { description: "Clear sky", iconCode: "01d" },
  801: { description: "Few clouds", iconCode: "02d" },
  // Add more as needed
};

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    if (!station) {
      return response.status(404).send("Station not found");
    }

    const reports = await reportStore.getReportsByStationId(station._id);

    const weatherCodes = [
      { code: 200, description: "Thunderstorm with light rain" },
      { code: 300, description: "Drizzle" },
      { code: 500, description: "Light rain" },
      { code: 600, description: "Light snow" },
      { code: 800, description: "Clear sky" },
      { code: 801, description: "Few clouds" },
      // Add more codes as needed
    ];

    const viewData = {
      title: station.title,
      station,
      reports,
      weatherCodes,
    };

    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    if (!station) {
      return response.status(404).send("Station not found");
    }

    const code = Number(request.body.code);
    const weatherInfo = weatherCodeMap[code] || { description: "Unknown", iconCode: "01d" };

    const newReport = {
      code: code,
      description: weatherInfo.description,
      iconCode: weatherInfo.iconCode,
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
      date: new Date(),
    };

    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },

  async deleteReport(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;

    await reportStore.deleteReport(reportId);
    response.redirect("/station/" + stationId);
  },
};
