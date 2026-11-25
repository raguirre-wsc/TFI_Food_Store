import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({defaultOptions: {queries: {retry: 1, staleTime: 20_000}}});
export function limpiarCachePrivado() {
  queryClient.removeQueries({predicate: query => ['pedidos', 'resumen', 'usuarios'].includes(String(query.queryKey[0]))});
}
export async function invalidar(...dominios: string[]) {
  await Promise.all(dominios.map(dominio => queryClient.invalidateQueries({queryKey: [dominio]})));
}
