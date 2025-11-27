import axios from "axios";
import { stringify } from "qs";

import { getRefreshToken, getToken, setRefreshToken, setToken } from "../../utils/token";
import { QS_OPTIONS } from "../constants/qs-options";
import { useAuthStore } from "@/src/modules/auth/stores/auth.store";

export const API_URL = 'https://dockmapapi-production-b51f.up.railway.app/'
// "https://dockmapapi-production.up.railway.app/";
//https://dockmapapi-production.up.railway.app/
//http://192.168.0.11:3000/
//http://192.168.0.50:3000/api
export const instance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
  paramsSerializer: (params) => stringify(params, QS_OPTIONS),
});

// Флаг для предотвращения одновременных запросов на обновление токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      // Сохраняем существующие заголовки и добавляем Authorization
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    // Пропускаем запросы на обновление токена, чтобы избежать бесконечного цикла
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если токен уже обновляется, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        const accessToken = await getToken();

        if (!refreshToken) {
          // Вызываем logout из store для обновления состояния и очистки токенов
          useAuthStore.getState().logout().catch(() => {});
          processQueue(error, null);
          isRefreshing = false;
          return Promise.reject(error);
        }

        // Отправляем оба токена, как требует бэкенд
        const response = await instance.post('/auth/refresh', {
          accessToken: accessToken || '',
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Токены не получены от сервера');
        }

        await setToken(newAccessToken);
        await setRefreshToken(newRefreshToken);

        // Обновляем заголовки для всех запросов в очереди
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        isRefreshing = false;
        return instance(originalRequest);
      } catch (e) {
        // При ошибке обновления токена вызываем logout из store
        // logout() уже удаляет токены и обновляет состояние
        useAuthStore.getState().logout().catch(() => {});
        processQueue(e, null);
        isRefreshing = false;
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
