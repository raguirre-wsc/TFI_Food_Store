import { api } from '../../../shared/api/axiosInstance';
import type { Producto, ProductoInput, ProductoFiltros, ProductosPaginados } from '../types';
export const productosApi = {
  listar: async (params: ProductoFiltros) => (await api.get<ProductosPaginados>('/productos', {params})).data,
  crear: async (v: ProductoInput) => (await api.post<Producto>('/productos', v)).data,
  editar: async (id: number, v: Partial<ProductoInput>) => (await api.put<Producto>(`/productos/${id}`, v)).data,
  stock: async (id: number, v: {stock: number; disponible: boolean}) => (await api.patch<Producto>(`/productos/${id}/stock`, v)).data,
  eliminar: async (id: number) => {await api.delete(`/productos/${id}`);},
};
