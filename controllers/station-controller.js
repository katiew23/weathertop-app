import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

const weatherCodeMap = {
  200: { description: "Thunderstorm with light rain", iconCode: "11d" },
  300: { description: "Drizzle",             iconCode: "09d" },
  500: { description: "Light rain",          iconCode: "10d" },
  600: { description: "Light snow",          iconCode: "13d" },
  701: { description: "Mist",                iconCode: "50d" },
  800: { description: "Clear sky",           iconCode: "01d" },
  801: { description: "Few clouds",          iconCode: "02d" },
};

function computeSummary(reports) {
  if (!reports.length) {
    return {
      minTemp:     null, maxTemp:     null,
      minWind:     null, maxWind:     null,
      minPressure: null, maxPressure: null,
    };
  }
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
  
  async index(request, response) {
    console.log("🚀 stationController.index hit for station id:", request.params.id);
    const station = await stationStore.getStationById(request.params.id);
    if (!station) {
      return response.status(404).send("Station not found");
    }
    const reports = await reportStore.getReportsByStationId(station._id);
    console.log("📑 reports in index:", reports);
    const summary = computeSummary(reports);
    const latestReport = reports.length ? reports[reports.length - 1] : null;
    const weatherCodes = [
      { code: 200, description: "Thunderstorm with light rain" },
      { code: 300, description: "Drizzle" },
      { code: 500, description: "Light rain" },
      { code: 600, description: "Light snow" },
      { code: 800, description: "Clear sky" },
      { code: 801, description: "Few clouds" },
    ];
    response.render("station-view", {
      title:       station.title,
      station,
      reports,
      weatherCodes,
      latestReport,
      ...summary,
    });
  },
  
  async addReport(request, response) {
    console.log("🔥 addReport hit –", request.method, request.url, "body:", request.body);
    try {
      const station = await stationStore.getStationById(request.params.id);
      if (!station) {
        return response.status(404).send("Station not found");
      }
      const code = Number(request.body.code);
      const info = weatherCodeMap[code] || { description: "Unknown", iconCode: "01d" };
      const newReport = {
        code,
        description:   info.description,
        iconCode:      info.iconCode,
        temperature:   Number(request.body.temperature),
        windSpeed:     Number(request.body.windSpeed),
        windDirection: request.body.windDirection,
        pressure:      Number(request.body.pressure),
        date:          new Date().toISOString(),
      };
      console.log("🕒 newReport:", newReport);
      await reportStore.addReport(station._id, newReport);
      response.redirect(`/station/${station._id}`);
    }
    catch (err) {
      console.error("❌ addReport error:", err);
      response.status(500).send("Internal Error");
    }
  },
  
  async deleteReport(request, response) {
    await reportStore.deleteReport(request.params.reportid);
    response.redirect(`/station/${request.params.stationid}`);
  },
  
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
  
  async trends(request, response) {
    const stationId = request.params.id;
    console.log("Fetching trends for station id:", stationId);
    const station = await stationStore.getStationById(stationId);
    
    if (!station) {
      console.log("Station not found for id:", stationId);
      return response.status(404).send("Station not found");
    }
    
    const reports = await reportStore.getReportsByStationId(stationId);
    reports.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = reports.map(r => new Date(r.date).toLocaleDateString());
    const temperatures = reports.map(r => r.temperature);
    const winds = reports.map(r => r.windSpeed);
    const pressures = reports.map(r => r.pressure);
    
    response.render('trends-view', { 
      title: `Trends for ${station.title}`,
      station,
      dates: JSON.stringify(dates),
      temperatures: JSON.stringify(temperatures),
      winds: JSON.stringify(winds),
      pressures: JSON.stringify(pressures)
    });
  },
  
  async autoGenerateReport(request, response) {
    const stationId = request.params.stationid;
    try {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const generatedReport = {
        code: 800,
        description: 'Clear sky',
        iconCode: '01d',
        temperature: parseFloat((Math.random() * 15 + 5).toFixed(1)),
        windSpeed: parseFloat((Math.random() * 20).toFixed(1)),
        windDirection: directions[Math.floor(Math.random() * directions.length)],
        pressure: parseFloat((980 + Math.random() * 40).toFixed(1)),
        date: new Date().toISOString(),
      };
      
      await reportStore.addReport(stationId, generatedReport);
      response.json(generatedReport);
    } catch (error) {
      console.error("Error auto-generating report:", error);
      response.status(500).send("Failed to auto-generate report");
    }
  }
};
