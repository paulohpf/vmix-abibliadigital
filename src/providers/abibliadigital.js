/* eslint-disable class-methods-use-this */
import { abibliadigital } from '@/plugins/axios';

class BibliaDigitalProvider {
  /**
   * Atualiza o token do usuário logado
   *
   * @param {Object} params - Objeto contendo parametros que serão utilizados na requisição;
   *
   * @param {String} params.email - E-mail cadastrado
   * @param {String} params.password - Senha cadastrada
   */
  updateToken(params) {
    return abibliadigital.put(`users/token`, {
      ...params,
    });
  }

  getVersions() {
    return abibliadigital.get(`versions`, {});
  }

  getBooks() {
    return abibliadigital.get(`books`, {});
  }

  getChapter(version, abbrev, chapter) {
    return abibliadigital.get(`verses/${version}/${abbrev}/${chapter}`, {});
  }
}

export default new BibliaDigitalProvider();
