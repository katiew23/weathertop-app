import { playlistStore } from "../models/playlist-store.js";
import { trackStore } from "../models/track-store.js";

export const trackController = {
  async index(request, response) {
    const playlistId = request.params.playlistid;
    const trackId = request.params.trackid;
    console.log(`Editing Track ${trackId} from Playlist ${playlistId}`);
    const viewData = {
      title: "Edit Song",
      playlist: await playlistStore.getPlaylistById(playlistId),
      track: await trackStore.getTrackById(trackId),
    };
    response.render("track-view", viewData);
  },

  async update(request, response) {
    const playlistId = request.params.playlistid;
    const trackId = request.params.trackid;
    const updatedTrack = {
      title: request.body.title,
      artist: request.body.artist,
      duration: Number(request.body.duration),
    };
    console.log(`Updating Track ${trackId} from Playlist ${playlistId}`);
    const track = await trackStore.getTrackById(trackId);
    await trackStore.updateTrack(track, updatedTrack);
    response.redirect("/playlist/" + playlistId);
  },
};