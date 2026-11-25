import { useQuery, useMutation } from '@tanstack/react-query';
import { categoriasApi } from '../api/categorias';
import type { CategoriaInput } from '../types';
import { invalidar } from '../../../shared/api/queryClient';
export function useCategorias() {return useQuery({queryKey: ['categorias'], queryFn: categoriasApi.listar});}
export function useGuardarCategoria() {return useMutation({mutationFn: ({id, data}: {id?: number; data: CategoriaInput}) => id ? categoriasApi.editar(id, data) : categoriasApi.crear(data), onSuccess: () => invalidar('categorias', 'productos')});}
export function useEliminarCategoria() {return useMutation({mutationFn: categoriasApi.eliminar, onSuccess: () => invalidar('categorias', 'productos')});}
