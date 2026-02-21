import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import bible from './bible';
import loader from './loader';
import persistedData from './persistedData';

Vue.use(Vuex);

export interface RootState {
  [key: string]: unknown;
}

const storeOptions: StoreOptions<RootState> = {
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
};

export default new Vuex.Store(storeOptions);
