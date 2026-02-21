import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '@/store';
import { BibliaDigitalStoreState } from './interface';

export const abibliadigital: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_ABIBLIADIGITAL_API_URL,
  timeout: 10000,
});

export const http: AxiosInstance = axios.create({
  timeout: 10000,
});

export default http;

abibliadigital.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    store.commit('updateLoaderState', true);

    const persisted = (store.state as BibliaDigitalStoreState).persistedData;
    const token = persisted.aBibliaDigital.token;

    if (token) {
      const newConfig = config;
      if (!newConfig.headers) {
        newConfig.headers = {};
      }
      newConfig.headers.Authorization = `Bearer ${token}`;
      return newConfig;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    store.commit('updateLoaderState', true);
    return Promise.reject(error);
  },
);

abibliadigital.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    store.commit('updateLoaderState', false);
    return response;
  },
  (error: AxiosError): Promise<unknown> | unknown => {
    store.commit('updateLoaderState', false);
    if (error.response) {
      return error.response.data;
    }
    return Promise.reject(error);
  },
);