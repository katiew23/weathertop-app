import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { engine } from "express-handlebars";
import { router } from "./routes.js";
import session from 'express-session';
import dayjs from "dayjs";


const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());

app.use(session({
  secret: 'yourSecretKeyHere',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.engine(".hbs", engine({
  extname: ".hbs",
  helpers: {
    getIconForCode: function (code) {
      const iconMap = {
        200: "11d", 300: "09d", 500: "10d",
        600: "13d", 701: "50d", 800: "01d",
        801: "02d", 802: "03d", 803: "04d", 804: "04d"
      };
      return iconMap[Number(code)] || "01d"; 
    },
    length: function (context) {
      return context ? context.length : 0;
    },
    subtract: function (a, b) {
      return a - b;
    },
    lookup: function (obj, field) {
      return obj && obj[field];
    },
    formatDateTime: function (dateString) {
      return dayjs(dateString).format("D MMM YYYY HH:mm");
    }
  }
}));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/", router);

const listener = app.listen(process.env.PORT || 4000, function () {
  console.log(`🌦️ WeatherTop started on http://localhost:${listener.address().port}`);
});
