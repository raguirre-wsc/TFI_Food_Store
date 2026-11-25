import { usePedido } from '../hooks/usePedidos';
import { Skeleton, EstadoError } from '../../../shared/components/Estados';
import { BadgeEstado, fecha, moneda } from '../../../shared/ui';
export function DetallePedido({id}: {id: number}) {
  const query = usePedido(id);
  if (query.isPending) return <Skeleton/>;
  if (query.isError) return <EstadoError error={query.error} retry={() => void query.refetch()}/>;
  const p = query.data;
  return <div className="order-detail"><BadgeEstado estado={p.estado}/><p className="muted">{fecha(p.created_at)}</p>
    <dl><dt>Entrega</dt><dd>{p.direccion_entrega}</dd><dt>Pago</dt><dd>{p.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'} · coordinación con el local</dd>{p.notas && <><dt>Indicaciones</dt><dd>{p.notas}</dd></>}</dl>
    {p.items.map(i => <div className="summary-row" key={i.producto_id}><div><strong>{i.cantidad} × {i.nombre_producto}</strong><small>{moneda(i.precio_unitario)} por unidad</small></div><strong>{moneda(i.subtotal)}</strong></div>)}
    <div className="summary-total"><span>Total confirmado</span><strong>{moneda(p.total)}</strong></div></div>;
}
