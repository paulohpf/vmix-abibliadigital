export interface UserData {
  email: string | null;
  name: string | null;
  token: string | null;
}

export interface PersistedDataState {
  aBibliaDigital: UserData;
}
