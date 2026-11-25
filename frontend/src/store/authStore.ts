import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '../features/auth/types';
import { authApi } from '../features/auth/api/auth';
import { limpiarCachePrivado } from '../shared/api/queryClient';
interface AuthState {
  usuario: Usuario | null; cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>; checkSession: () => Promise<void>; limpiar: () => void;
}
export const useAuthStore = create<AuthState>()(persist((set) => ({
  usuario: null, cargando: true,
  login: async (username, password) => { await authApi.login(username, password); const usuario = await authApi.me(); limpiarCachePrivado(); set({usuario, cargando: false}); },
  logout: async () => { await authApi.logout(); limpiarCachePrivado(); set({usuario: null, cargando: false}); },
  checkSession: async () => {set({cargando: true}); try {set({usuario: await authApi.me()});} catch {limpiarCachePrivado(); set({usuario: null});} finally {set({cargando: false});}},
  limpiar: () => {limpiarCachePrivado(); set({usuario: null, cargando: false});},
}), {name: 'foodstore-sesion', partialize: state => ({usuario: state.usuario})}));
