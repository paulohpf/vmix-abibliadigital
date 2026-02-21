import { PersistedDataState, UserData } from './interface';

export default {
  state: (): PersistedDataState => ({
    aBibliaDigital: {
      email: null,
      name: null,
      token: null,
    },
  }),
  mutations: {
    setBibliaDigitalUserData(state: PersistedDataState, data: UserData): void {
      state.aBibliaDigital = data;
    },
  },
  getters: {
    getBibliaDigitalUserData(state: PersistedDataState): UserData {
      return state.aBibliaDigital;
    },
  },
};
