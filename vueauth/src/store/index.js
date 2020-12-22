import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    updateUser({ commit }, value) {
      commit("updateUser", value);
    },
    setUser({ commit }, value) {
      commit("setUser", value);
    },
  },
  mutations: {
    updateUser: (state, value) => (state.user = value),
    setUser: (state, value) => (state.user = value),
  },
});
