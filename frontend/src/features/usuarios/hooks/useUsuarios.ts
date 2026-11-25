import { useMutation, useQuery } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuarios';
import { invalidar } from '../../../shared/api/queryClient';
export function useUsuarios() {return useQuery({queryKey: ['usuarios'], queryFn: usuariosApi.listar});}
export function useActivarUsuario() {return useMutation({mutationFn: ({id, activo}: {id: number; activo: boolean}) => usuariosApi.cambiarActivo(id, activo), onSuccess: () => invalidar('usuarios')});}
