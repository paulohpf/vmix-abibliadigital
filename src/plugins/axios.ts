import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import store from '@/store';

export const abibliadigital: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_ABIBLIADIGITAL_API_URL,
  timeout: 10000,
});

export const http: AxiosInstance = axios.create({
  timeout: 10000,
});

export default http;

// request header
abibliadigital.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    store.commit('updateLoaderState', true);

    const persistedState = store.state.persistedData as any;
    if (persistedState?.aBibliaDigital?.token) {
      const newConfig = config as any;
      if (newConfig.headers) {
        newConfig.headers.Authorization = `Bearer ${persistedState.aBibliaDigital.token}`;
      }
      return newConfig;
    }
    return config;
  },
  (error) => {
    store.commit('updateLoaderState', false);
    return Promise.reject(error);
  },
);

abibliadigital.interceptors.response.use(
  (config) => {
    store.commit('updateLoaderState', false);
    return config;
  },
  (error) => {
    store.commit('updateLoaderState', false);
    return Promise.reject(error);
  },
);
