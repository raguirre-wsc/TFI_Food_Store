import { Button } from '../ui';
export function Paginacion({skip, limit, total, cambiar}: {skip: number; limit: number; total: number; cambiar: (n: number) => void}) {
  return <div className="pagination"><span>{total ? `${skip + 1}–${Math.min(skip + limit, total)} de ${total}` : '0 resultados'}</span>
    <div className="actions"><Button className="btn-secondary" disabled={!skip} onClick={() => cambiar(Math.max(0, skip-limit))}>Anterior</Button>
    <Button className="btn-secondary" disabled={skip+limit >= total} onClick={() => cambiar(skip+limit)}>Siguiente</Button></div></div>;
}
