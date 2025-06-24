import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { engine } from "express-handlebars";
import { router } from "./routes.js";

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());

// Register the Handlebars engine with helpers
app.engine(".hbs", engine({
  extname: ".hbs",
  helpers: {
    getIconForCode: function (code) {
      const iconMap = {
        200: "11d", 201: "11d", 202: "11d",
        230: "11d", 231: "11d", 232: "11d",
        300: "09d", 301: "09d", 302: "09d",
        500: "10d", 501: "10d", 502: "10d",
        600: "13d", 601: "13d", 602: "13d",
        701: "50d", 711: "50d", 721: "50d",
        800: "01d",
        801: "02d", 802: "03d", 803: "04d", 804: "04d"
      };

      const numericCode = Number(code);
      return iconMap[numericCode] || "01d"; // fallback icon
    }
  }
}));

app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/", router);

const listener = app.listen(process.env.PORT || 4000, function () {
  console.log(`🌦️ WeatherTop started on http://localhost:${listener.address().port}`);
});

