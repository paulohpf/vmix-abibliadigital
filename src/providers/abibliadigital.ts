/* eslint-disable class-methods-use-this */
import { AxiosResponse } from 'axios';
import { abibliadigital } from '@/plugins/axios';
import { CredentialsParams } from './interface';

class BibliaDigitalProvider {
  updateToken(params: CredentialsParams): Promise<AxiosResponse> {
    return abibliadigital.put('users/token', {
      ...params,
    });
  }

  getVersions(): Promise<AxiosResponse> {
    return abibliadigital.get('versions', {});
  }

  getBooks(): Promise<AxiosResponse> {
    return abibliadigital.get('books', {});
  }

  getChapter(version: string, abbrev: string, chapter: number): Promise<AxiosResponse> {
    return abibliadigital.get(`verses/${version}/${abbrev}/${chapter}`, {});
  }
}

export default new BibliaDigitalProvider();
