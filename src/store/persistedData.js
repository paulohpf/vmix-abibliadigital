export default {
  state: {
    aBibliaDigital: {
      email: null,
      name: null,
      token: null,
    },
  },
  mutations: {
    setBibliaDigitalUserData(state, data) {
      state.aBibliaDigital = data;
    },
  },
  getters: {
    getBibliaDigitalUserData(state) {
      return state.aBibliaDigital;
    },
  },
};
