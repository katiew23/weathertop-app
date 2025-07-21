import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { engine } from "express-handlebars";
import { router } from "./routes.js";
import session from "express-session";
import dayjs from "dayjs";
import fs from "fs";
import yaml from "js-yaml";
import { stationStore } from "./models/station-store.js";
import { reportStore } from "./models/report-store.js";

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());

app.use(session({
  secret: "abc123456789",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.engine(".hbs", engine({
  extname: ".hbs",
  helpers: {
    getIconForCode(code) {
      const iconMap = {
        200: "11d", 300: "09d", 500: "10d",
        600: "13d", 701: "50d", 800: "01d",
        801: "02d", 802: "03d", 803: "04d", 804: "04d"
      };
      return iconMap[Number(code)] || "01d";
    },
    length(ctx) {
      return ctx ? ctx.length : 0;
    },
    subtract(a, b) {
      return a - b;
    },
    lookup(obj, field) {
      return obj && obj[field];
    },
    formatDateTime(dt) {
      return dayjs(dt).format("D MMM YYYY HH:mm");
    },
    round(n) {
      return Math.round(n);
    },
    roundToDecimal(n, d = 0) {
      return typeof n === "number" ? n.toFixed(d) : n;
    },
    json(ctx) {
      return JSON.stringify(ctx);
    },
    windChill(temp, speed) {
      const wc = 13.12
               + 0.6215 * temp
               - 11.37 * Math.pow(speed, 0.16)
               + 0.3965 * temp * Math.pow(speed, 0.16);
      return Math.round(wc * 10) / 10;
    }
  }
}));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/", router);

(async () => {
  const raw = fs.readFileSync("./data/sample-data.yaml", "utf8");
  const sample = yaml.load(raw);

  const existingStations = await stationStore.getAllStations();
  if (!existingStations.length) {
    for (const st of sample.stations) {
      await stationStore.addStation(st);
    }
  }

  const existingReports = await reportStore.getAllReports();
  if (!existingReports.length) {
    for (const rp of sample.reports) {
      await reportStore.addReport(rp.stationId, rp);
    }
  }

  const listener = app.listen(process.env.PORT || 4000, () => {
    console.log(`🌦️ WeatherTop started on http://localhost:${listener.address().port}`);
  });
})();


//https://expressjs.com/en/guide/routing.html
//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
//this is like utilities in programming really, whenever we use these helper methods elsewhere we dont have to rewrtie the code
