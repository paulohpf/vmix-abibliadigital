import Vue from 'vue';
import Vuex, { createLogger } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import content from './content';
import loader from './loader';
import persistedData from './persistedData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    content,
    loader,
    persistedData,
  },
  plugins: [
    createPersistedState({
      paths: ['persistedData.aBibliaDigital', 'content'],
    }),
    createLogger(),
  ],
});
