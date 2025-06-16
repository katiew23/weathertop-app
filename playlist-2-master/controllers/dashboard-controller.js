import { playlistStore } from "../models/playlist-store.js";

export const dashboardController = {
  async index(request, response) {
    const viewData = {
      title: "Playlist Dashboard",
      playlists: await playlistStore.getAllPlaylists(),
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },

  async addPlaylist(request, response) {
    const newPlayList = {
      title: request.body.title,
    };
    console.log(`adding playlist ${newPlayList.title}`);
    await playlistStore.addPlaylist(newPlayList);
    response.redirect("/dashboard");
  },
};
