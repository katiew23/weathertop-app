# Weather app 2 basewline
# WeatherTop (Baseline Version)

## Overview
WeatherTop is a web application that allows users to monitor and manage their personal weather stations. This baseline version includes functionality for user login, station management, and adding weather reports.

---

## Features
- 👤 User authentication (sign up, login, logout)
- 📍 Add new weather stations with a title (and optional location)
- 📋 View a list of all your stations on the dashboard
- 🔍 Click on a station to view its detail page
- 📈 Add weather reports to each station with the following data:
  - Weather code
  - Temperature (°C)
  - Wind Speed (km/h)
  - Pressure (hPa)
- ❌ Delete stations and reports

---

## Technologies Used
- Node.js
- Express.js
- Handlebars (HBS)
- MongoDB
- HTML, CSS (Bulma)

---

## Project Structure

Weatherapp2/
├── controllers/
│ ├── accounts-controller.js
│ ├── dashboard-controller.js
│ └── station-controller.js
├── models/
│ ├── station-store.js
│ └── report-store.js
├── views/
│ ├── layouts/
│ ├── partials/
│ └── *.hbs (main, dashboard, station views, etc.)
├── routes.js
├── server.js
├── package.json
└── README.md

---

## Getting Started

1. **Clone or unzip the repository**
   - If zipped: extract to a folder like `Weatherapp2`

2. **Install dependencies**
   ```bash
   npm install
   npm start
http://localhost:3000

