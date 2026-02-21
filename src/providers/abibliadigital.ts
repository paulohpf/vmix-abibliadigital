import { AxiosPromise } from 'axios';
import { abibliadigital } from '@/plugins/axios';

interface TokenParams {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface ApiResponse {
  [key: string]: unknown;
}

class BibliaDigitalProvider {
  /**
   * Atualiza o token do usuário logado
   *
   * @param {Object} params - Objeto contendo parametros que serão utilizados na requisição;
   * @param {String} params.email - E-mail cadastrado
   * @param {String} params.password - Senha cadastrada
   */
  updateToken(params: TokenParams): AxiosPromise<ApiResponse> {
    return abibliadigital.put('users/token', {
      ...params,
    });
  }

  getVersions(): AxiosPromise<ApiResponse> {
    return abibliadigital.get('versions', {});
  }

  getBooks(): AxiosPromise<ApiResponse> {
    return abibliadigital.get('books', {});
  }

  getChapter(version: string, abbrev: string, chapter: string | number): AxiosPromise<ApiResponse> {
    return abibliadigital.get(`verses/${version}/${abbrev}/${chapter}`, {});
  }
}

export default new BibliaDigitalProvider();
