import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import bible from './bible';
import loader from './loader';
import persistedData from './persistedData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    bible,
    loader,
    persistedData,
  },
  plugins: [
    createPersistedState({
      paths: ['persistedData.aBibliaDigital', 'bible'],
    }),
  ],
});
