import loaderModule from '@/store/loader';
import { LoaderState } from '@/store/loader/interface';

describe('store/loader', () => {
  const createState = (): LoaderState => loaderModule.state();

  it('inicia com active false', () => {
    expect(createState().active).toBe(false);
  });

  it('updateLoaderState atualiza active', () => {
    const state = createState();

    loaderModule.mutations.updateLoaderState(state, true);

    expect(state.active).toBe(true);
    expect(loaderModule.getters.loaderActive(state)).toBe(true);
  });
});
