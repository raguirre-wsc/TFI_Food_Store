import axios from 'axios';
export const api = axios.create({baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1', withCredentials: true, timeout: 15000});
let sessionExpired: () => void = () => undefined;
export function setSessionExpiredHandler(handler: () => void) { sessionExpired = handler; }
api.interceptors.response.use(response => response, (error: unknown) => {
  if (axios.isAxiosError<{detail?: unknown}>(error)) {
    const url = error.config?.url ?? '';
    const auth = ['/auth/token', '/auth/me'].some(route => url.includes(route));
    if ((error.response?.status === 401 && !auth) ||
        (error.response?.status === 400 && error.response.data.detail === 'Cuenta de usuario desactivada')) sessionExpired();
  }
  return Promise.reject(error);
});
