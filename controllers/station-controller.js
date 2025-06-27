import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

// Map of weather codes to descriptions & icons
const weatherCodeMap = {
  200: { description: "Thunderstorm with light rain", iconCode: "11d" },
  300: { description: "Drizzle",             iconCode: "09d" },
  500: { description: "Light rain",          iconCode: "10d" },
  600: { description: "Light snow",          iconCode: "13d" },
  701: { description: "Mist",                iconCode: "50d" },
  800: { description: "Clear sky",           iconCode: "01d" },
  801: { description: "Few clouds",          iconCode: "02d" },
};

// Helper to get min/max of temp, wind, pressure
function computeSummary(reports) {
  if (!reports.length) {
    return {
      minTemp:     null, maxTemp:     null,
      minWind:     null, maxWind:     null,
      minPressure: null, maxPressure: null,
    };
  }

  // Coerce to numbers
  const temps     = reports.map(r => Number(r.temperature));
  const winds     = reports.map(r => Number(r.windSpeed));
  const pressures = reports.map(r => Number(r.pressure));

  return {
    minTemp:     Math.min(...temps),
    maxTemp:     Math.max(...temps),
    minWind:     Math.min(...winds),
    maxWind:     Math.max(...winds),
    minPressure: Math.min(...pressures),
    maxPressure: Math.max(...pressures),
  };
}

export const stationController = {
  // Show station + reports + summary
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    if (!station) {
      return response.status(404).send("Station not found");
    }

    // Grab all reports for this station
    const reports = await reportStore.getReportsByStationId(station._id);

    // Fill in any missing iconCodes
    reports.forEach(r => {
      if (!r.iconCode) {
        const info = weatherCodeMap[r.code] || {};
        r.iconCode = info.iconCode || "01d";
        r.description = info.description || "Unknown";
      }
    });

    // Compute min/max values
    const summary = computeSummary(reports);

    // Latest report is just the last one in the array
    const latestReport = reports.length
      ? reports[reports.length - 1]
      : null;

    // For your “Add Reading” dropdown
    const weatherCodes = [
      { code: 200, description: "Thunderstorm with light rain" },
      { code: 300, description: "Drizzle" },
      { code: 500, description: "Light rain" },
      { code: 600, description: "Light snow" },
      { code: 800, description: "Clear sky" },
      { code: 801, description: "Few clouds" },
    ];

    // Pass everything down to the template
    response.render("station-view", {
      title:       station.title,
      station,
      reports,
      weatherCodes,
      latestReport,
      ...summary,    // spreads minTemp, maxTemp, etc.
    });
  },

  // Add a new reading
  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    if (!station) {
      return response.status(404).send("Station not found");
    }

    const code = Number(request.body.code);
    const info = weatherCodeMap[code] || { description: "Unknown", iconCode: "01d" };

    const newReport = {
      code,
      description: info.description,
      iconCode:    info.iconCode,
      temperature: Number(request.body.temperature),
      windSpeed:   Number(request.body.windSpeed),
      windDirection: request.body.windDirection,
      pressure:    Number(request.body.pressure),
      date:        new Date(),
    };

    await reportStore.addReport(station._id, newReport);
    response.redirect(`/station/${station._id}`);
  },

  // Delete an existing reading
  async deleteReport(request, response) {
    await reportStore.deleteReport(request.params.reportid);
    response.redirect(`/station/${request.params.stationid}`);
  },

  // Create a new station
  async addStation(request, response) {
    const newStation = {
      title:     request.body.title,
      latitude:  Number(request.body.latitude),
      longitude: Number(request.body.longitude),
      userid:    request.session.userid,
    };

    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
};
