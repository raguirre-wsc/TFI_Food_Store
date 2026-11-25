import { api } from '../../../shared/api/axiosInstance';
import type { Categoria, CategoriaInput } from '../types';
export const categoriasApi = {
  listar: async () => (await api.get<Categoria[]>('/categorias')).data,
  crear: async (v: CategoriaInput) => (await api.post<Categoria>('/categorias', v)).data,
  editar: async (id: number, v: Partial<CategoriaInput>) => (await api.put<Categoria>(`/categorias/${id}`, v)).data,
  eliminar: async (id: number) => {await api.delete(`/categorias/${id}`);},
};
