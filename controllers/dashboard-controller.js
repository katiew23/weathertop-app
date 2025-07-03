import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";

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
  }
};
