import persistedDataModule from '@/store/persistedData';
import { PersistedDataState, UserData } from '@/store/persistedData/interface';

describe('store/persistedData', () => {
  const createState = (): PersistedDataState => persistedDataModule.state();

  it('inicia dados do usuário nulos', () => {
    const state = createState();

    expect(state.aBibliaDigital).toEqual({
      email: null,
      name: null,
      token: null,
    });
  });

  it('setBibliaDigitalUserData atualiza payload persistido', () => {
    const state = createState();
    const payload: UserData = {
      email: 'teste@exemplo.com',
      name: 'Usuário Teste',
      token: 'abc123',
    };

    persistedDataModule.mutations.setBibliaDigitalUserData(state, payload);

    expect(state.aBibliaDigital).toEqual(payload);
    expect(persistedDataModule.getters.getBibliaDigitalUserData(state)).toEqual(
      payload,
    );
  });
});
