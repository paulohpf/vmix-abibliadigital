export default {
  state: { active: false },
  getters: {
    loaderActive(state) {
      return state.active;
    },
  },
  mutations: {
    updateLoaderState(state, value) {
      state.active = value;
    },
  },
};
