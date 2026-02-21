import { LoaderState } from './interface';

export default {
  state: (): LoaderState => ({
    active: false,
  }),
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
