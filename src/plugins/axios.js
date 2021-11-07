import axios from 'axios';
import store from '@/store';

export const abibliadigital = axios.create({
  baseURL: process.env.VUE_APP_ABIBLIADIGITAL_API_URL,
  timeout: 10000,
});

export const http = axios.create({
  timeout: 10000,
});

export default http;

// request header
abibliadigital.interceptors.request.use(
  config => {
    store.commit('updateLoaderState', true);

    if (store.state.persistedData.aBibliaDigital.token) {
      const newConfig = config;
      newConfig.headers.Authorization = `Bearer ${store.state.persistedData.aBibliaDigital.token}`;
      // console.log(newConfig);
      // return Promise.reject();
      return newConfig;
    }
    return config;
  },
  error => {
    store.commit('updateLoaderState', true);
    return Promise.reject(error);
  },
);

abibliadigital.interceptors.response.use(
  response => {
    store.commit('updateLoaderState', false);
    return response;
  },
  error => {
    store.commit('updateLoaderState', false);
    console.error('Error status', error.response.status);
    if (error.response) {
      return error.response.data;
    }
    return Promise.reject(error);
  },
);
