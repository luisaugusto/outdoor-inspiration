import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    parks: [],
    count: 0
  },
  mutations: {
    set(state, parks) {
      state.parks = parks;
    },
    increment(state) {
      state.count++;
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
      await commit("set", parks);
    }
  }
});
