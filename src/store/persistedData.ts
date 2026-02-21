import { Module } from 'vuex';
import { RootState } from '@/store/index';

interface UserData {
  email: string | null;
  name: string | null;
  token: string | null;
}

interface PersistedDataState {
  aBibliaDigital: UserData;
}

const persistedData: Module<PersistedDataState, RootState> = {
  state: {
    aBibliaDigital: {
      email: null,
      name: null,
      token: null,
    },
  },
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

export default persistedData;
