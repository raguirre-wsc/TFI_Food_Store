import { useQuery, useMutation } from '@tanstack/react-query';
import { pedidosApi } from '../api/pedidos';
import type { EstadoPedido } from '../types';
import { invalidar } from '../../../shared/api/queryClient';
import { useAuthStore } from '../../../store/authStore';
export function usePedidos(skip: number, estado?: EstadoPedido) {
  const usuario = useAuthStore(s => s.usuario);
  return useQuery({queryKey: ['pedidos', usuario?.id, {skip, estado}], queryFn: () => pedidosApi.listar({skip, limit: 10, estado})});
}
export function usePedido(id: number | null) {return useQuery({queryKey: ['pedidos', 'detalle', id], queryFn: () => pedidosApi.detalle(id!), enabled: id !== null});}
const actualizar = () => invalidar('pedidos', 'productos', 'resumen');
export function useCrearPedido() {return useMutation({mutationFn: pedidosApi.crear, onSuccess: actualizar});}
export function useCancelarPedido() {return useMutation({mutationFn: pedidosApi.cancelar, onSuccess: actualizar});}
export function useCambiarEstadoPedido() {return useMutation({mutationFn: ({id, estado}: {id: number; estado: EstadoPedido}) => pedidosApi.cambiarEstado(id, estado), onSuccess: actualizar});}
export function useResumenPedidos() {return useQuery({queryKey: ['resumen'], queryFn: pedidosApi.resumen});}
