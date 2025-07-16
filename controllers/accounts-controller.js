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
    request.session.userid = null;  
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
  const newUser = await userStore.addUser(user);
  console.log(`Registering ${newUser.email}`);
  request.session.userid = newUser._id;
  console.log(`Logging in ${newUser.email}`);
    response.redirect("/dashboard");
},
  
  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      request.session.userid = user._id;  
      console.log(`Logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },
  
  async getLoggedInUser(request) {
    const userId = request.session.userid;  
    return await userStore.getUserById(userId);  
  },
  
  async showProfile(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    response.render('profile-view', { title: 'Your Profile', user: loggedInUser });
  },
  
  async updateProfile(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    
    console.log("Updating profile for user:", loggedInUser._id);
    console.log("New data:", request.body);
    
    const updatedData = {
      name: request.body.name,
      email: request.body.email,
    };
    
    await userStore.updateUser(loggedInUser._id, updatedData);
    response.redirect('/profile');
  },
  
  async deleteProfile(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    
    await userStore.deleteUserById(loggedInUser._id);
    request.session.destroy(() => {
      response.redirect('/');
    });
  }
};
//this is for all words my user hub everything controlled here
//like space planets for programming controllers and methods all stored separate
