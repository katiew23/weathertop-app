export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "Weather",
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
//controls about button when you click it and what u see