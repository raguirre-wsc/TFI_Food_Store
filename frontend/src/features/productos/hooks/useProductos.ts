import { useQuery, useMutation } from '@tanstack/react-query';
import { productosApi } from '../api/productos';
import type { ProductoInput, ProductoFiltros } from '../types';
import { invalidar } from '../../../shared/api/queryClient';
export function useProductos(filtros: ProductoFiltros) {return useQuery({queryKey: ['productos', filtros], queryFn: () => productosApi.listar(filtros)});}
export function useGuardarProducto() {return useMutation({mutationFn: (v: {id: number; data: Partial<ProductoInput>} | {id?: undefined; data: ProductoInput}) => v.id !== undefined ? productosApi.editar(v.id, v.data) : productosApi.crear(v.data), onSuccess: () => invalidar('productos')});}
export function useStockProducto() {return useMutation({mutationFn: ({id, stock, disponible}: {id: number; stock: number; disponible: boolean}) => productosApi.stock(id, {stock, disponible}), onSuccess: () => invalidar('productos')});}
export function useEliminarProducto() {return useMutation({mutationFn: productosApi.eliminar, onSuccess: () => invalidar('productos')});}
