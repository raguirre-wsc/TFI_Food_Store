import { PackageOpen, AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import { handleApiError } from '../api/handleApiError';
export function Skeleton() { return <div className="skeleton-grid" role="status" aria-label="Cargando"><div/><div/><div/></div>; }
export function EstadoVacio({texto = 'Todavía no hay resultados.'}: {texto?: string}) { return <div className="empty"><PackageOpen size={36}/><p>{texto}</p></div>; }
export function EstadoError({error, retry}: {error: unknown; retry?: () => void}) {
  return <div role="alert" className="error"><AlertCircle size={20}/><span>{handleApiError(error)}</span>{retry && <Button className="btn-ghost" onClick={retry}>Reintentar</Button>}</div>;
}
