import { api } from '../../../shared/api/axiosInstance';
import type { Usuario, Registro } from '../types';
export const authApi = {
  me: async () => (await api.get<Usuario>('/auth/me')).data,
  login: async (username: string, password: string) => {await api.post('/auth/token', new URLSearchParams({username, password}));},
  register: async (data: Registro) => (await api.post<Usuario>('/auth/register', data)).data,
  logout: async () => {await api.post('/auth/logout');},
};
