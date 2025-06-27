import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

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
  }
};

