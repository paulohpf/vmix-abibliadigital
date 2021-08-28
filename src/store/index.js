import Vue from 'vue';
import Vuex from 'vuex';

import bible from './bible';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    bible,
  },
});
