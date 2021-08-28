import axios from 'axios';

const abibliadigital = axios.create({
  baseURL: process.env.ABIBLIADIGITAL_API_URL,
  timeout: 10000,
});

export default abibliadigital;
