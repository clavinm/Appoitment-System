import axios from 'axios';
import { BASE_URL } from '../constants';

const errorHandler = (error: any) => {
  if (error?.response && error?.response?.data) {
    throw error.response.data;
  } else {
    throw error;
  }
};

const commonAxiosConfig = {
  baseURL: `${BASE_URL}`,
  withCredentials: true,
};

export const jsonApiClient = axios.create({
  ...commonAxiosConfig,
});

jsonApiClient.interceptors.response.use((response) => response, errorHandler);
