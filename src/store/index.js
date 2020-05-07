import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    parks: [],
    activePark: {}
  },
  mutations: {
    setParks(state, parks) {
      state.parks = parks;
    },
    setPark(state, park) {
      state.activePark = park;
    }
  },
  actions: {
    async getParks({ commit }) {
      let files = await require.context("../parks/", false, /\.json$/);
      let parks = files.keys().map(key => {
        let res = files(key);
        res.slug = key.slice(2, -5);
        return res;
      });
      await commit("setParks", parks);
    },
    async getParkPhoto(commit, gallery) {
      const photos = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=f375aa1900bbc11875d0e35318456809&gallery_id=${gallery}&extras=owner_name%2C+url_k%2C+url_h%2C+url_l&format=json&nojsoncallback=1`
      ).then(data => data.json());

      const countPhotos = photos.photos.photo.length;
      const randomPhoto = Math.floor(Math.random() * countPhotos);

      return photos.photos.photo[randomPhoto];
    },
    async getActivePark({ state, commit, dispatch }) {
      const parksLength = state.parks.length;
      const randomParkIndex = Math.floor(Math.random() * parksLength);
      const parkData = state.parks[randomParkIndex];
      parkData.photo = await dispatch("getParkPhoto", parkData["gallery-id"]);

      commit("setPark", parkData);
    }
  }
});
