# WeatherTop

## Overview
WeatherTop is a web application designed to help users track, manage, and monitor their personal weather stations. Users can:
- Create an account and log in  
- Add multiple stations (with name, location, latitude & longitude)  
- Automatically fetch live weather data from OpenWeatherMap  
- View and delete stations and individual weather reports  
- See interactive trend charts (temperature, wind speed, pressure) powered by Frappe Charts  
- Explore station locations on an interactive Leaflet map  
- Consult a Help page for common coordinates or external tools (LatLong.net)

### User Management
- Sign up, login, logout, and profile editing  
- Secure session handling  

### Station Management
- Add, list, and delete stations  
- Store precise latitude & longitude for each station  
- Dashboard view with current weather summary for each station  
- Interactive map showing station markers  

### Weather Reports
- Auto‑generate reports based on station coordinates  
- Manual report entry (weather code, temp, wind, pressure)  
- Reports include timestamp, description, and icon  

### Trends Visualization
- Line charts for temperature, wind speed, and pressure over time  
- Implemented with [Frappe Charts](https://frappe.io/charts)  

### Help & Usability
- Help page listing common location coordinates  
- Link to [LatLong.net](https://www.latlong.net/) for custom lookups  

## Technologies Used
- **Backend:** Node.js, Express.js  
- **Templating:** Handlebars (HBS)  
- **Database:** LowDB (file‑based JSON store) , seeded from YAML
- **Charts:** Frappe Charts  
- **Maps:** Leaflet.js + OpenStreetMap tiles  
- **Styling:** Bulma CSS  

## Project Structure
WeatherTop/
├── controllers/
│   ├── accounts-controller.js
│   ├── dashboard-controller.js
│   ├── station-controller.js
│   └── report-controller.js
├── models/
│   ├── station-store.js
│   ├── report-store.js
│   └── user-store.js
├── public/
│   ├── css/
│   └── js/
├── routes.js
├── views/
│   ├── layouts/
│   │   └── main.hbs
│   ├── partials/
│   ├── dashboard-view.hbs
│   ├── station-view.hbs
│   ├── trends-view.hbs
│   ├── login-view.hbs
│   ├── signup-view.hbs
│   ├── profile-view.hbs
│   ├── report-view.hbs
│   └── help-view.hbs
├── server.js
├── package.json
└── README.md

## Installation & Setup
git clone https://github.com/yourusername/weathertop-app.git
cd weathertop-app
npm install
create or review data/sample-data.yaml for your initial stations & reports
Open controllers/dashboard-controller.js and controllers/report-controller.js, then replace the hard‑coded apiKey value near the top of each file with your own OpenWeatherMap API key.

## Usage
- Sign up for a new account or log in  
- Add a station on the Dashboard with its title, location, and coordinates  
- View stations on the Dashboard (with summary and map pins)  
- Auto‑generate a live weather report or add manually  
- Click a station to see all its reports and add/edit/delete entries  
- View Trends for any station to see interactive charts of temperature, wind speed, and pressure over time  
- Consult the Help page for common lat/lon values or external lookup  

## Future Improvements
- Multi‑day forecasts & hourly trend views  
- Push notifications for severe weather alerts  
- Export reports to CSV or PDF  
- Role‑based access and shared station support  
- Mobile‑first UI enhancements  

## References
- OpenWeatherMap API  
- Frappe Charts  
- Leaflet.js  
- LatLong.net  
