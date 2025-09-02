import axios, { AxiosInstance } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    omieAuth?: {
      appKey?: string;
      appSecret?: string;
    };
  }
}

const OMIE_BASE_URL =
  process.env.OMIE_API_URL ?? 'https://app.omie.com.br/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: OMIE_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toLowerCase();

  if (['post', 'put', 'patch'].includes(method)) {
    const envKey = process.env.OMIE_APP_KEY;
    const envSecret = process.env.OMIE_APP_SECRET;

    const appKey = config.omieAuth?.appKey ?? envKey;
    const appSecret = config.omieAuth?.appSecret ?? envSecret;

    let data: any = config.data;
    let wasString = false;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
        wasString = true;
      } catch {
        data = {};
      }
    }
    if (data == null || typeof data !== 'object') data = {};

    if (appKey && data.app_key == null) data.app_key = appKey;
    if (appSecret && data.app_secret == null) data.app_secret = appSecret;

    config.data = wasString ? JSON.stringify(data) : data;
  }

  return config;
});

export default api;
