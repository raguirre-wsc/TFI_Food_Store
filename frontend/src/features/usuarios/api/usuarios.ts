import { api } from '../../../shared/api/axiosInstance';
import type { Usuario } from '../types';
export const usuariosApi = {
  listar: async () => (await api.get<Usuario[]>('/admin/usuarios')).data,
  cambiarActivo: async (id: number, activo: boolean) => (await api.post<Usuario>(`/admin/usuarios/${id}/${activo ? 'activar' : 'desactivar'}`)).data,
};
