import { api } from '../../../shared/api/axiosInstance';
import type { Pedido, PedidoCreate, EstadoPedido, PedidosPaginados, ResumenPedidos } from '../types';
export const pedidosApi = {
  listar: async (params: {skip: number; limit: number; estado?: EstadoPedido}) => (await api.get<PedidosPaginados>('/pedidos', {params})).data,
  detalle: async (id: number) => (await api.get<Pedido>(`/pedidos/${id}`)).data,
  crear: async (v: PedidoCreate) => (await api.post<Pedido>('/pedidos', v)).data,
  cambiarEstado: async (id: number, estado: EstadoPedido) => (await api.patch<Pedido>(`/pedidos/${id}/estado`, {estado})).data,
  cancelar: async (id: number) => (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data,
  resumen: async () => (await api.get<ResumenPedidos>('/pedidos/resumen')).data,
};
