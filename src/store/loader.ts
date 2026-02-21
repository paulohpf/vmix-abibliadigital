import { Module } from 'vuex';
import { RootState } from '@/store/index';

interface LoaderState {
  active: boolean;
}

const loader: Module<LoaderState, RootState> = {
  state: {
    active: false,
  },
  getters: {
    loaderActive(state: LoaderState): boolean {
      return state.active;
    },
  },
  mutations: {
    updateLoaderState(state: LoaderState, value: boolean): void {
      state.active = value;
    },
  },
};

export default loader;
