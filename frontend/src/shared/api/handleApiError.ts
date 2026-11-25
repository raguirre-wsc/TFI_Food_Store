import axios from 'axios';
export function handleApiError(error: unknown): string {
  if (!axios.isAxiosError<{detail?: unknown}>(error)) return error instanceof Error ? error.message : 'No se pudo completar la operación.';
  if (!error.response) return 'No se pudo conectar con el servidor. Revisá la conexión e intentá nuevamente.';
  const detail = error.response.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((item: unknown) => {
    if (typeof item === 'object' && item !== null && 'msg' in item) return String(item.msg);
    return 'Revisá los datos ingresados';
  }).join('. ');
  return 'No se pudo completar la operación. Intentá nuevamente.';
}
