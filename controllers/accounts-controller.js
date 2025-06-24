import { userStore } from "../models/user-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to WeatherTop",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("weathertop", ""); // changed from 'playlist'
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Signup to WeatherTop",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`Registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("weathertop", user.email); // changed from 'playlist'
      console.log(`Logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.weathertop; // changed from 'playlist'
    return await userStore.getUserByEmail(userEmail);
  },
};
