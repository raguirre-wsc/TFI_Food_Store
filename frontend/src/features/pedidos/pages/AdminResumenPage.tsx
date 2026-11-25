import { Clock3, ChefHat, CircleCheck, CircleX, ShoppingBag, Wallet } from 'lucide-react';
import { useResumenPedidos } from '../hooks/usePedidos';
import { EstadoError, Skeleton } from '../../../shared/components/Estados';
import { moneda } from '../../../shared/ui';
export function AdminResumenPage() {
  const query = useResumenPedidos();
  return <><div className="page-heading"><div><span className="eyebrow">Administración</span><h1>El negocio, de un vistazo.</h1><p>Información actualizada para organizar la cocina.</p></div></div>
    {query.isPending ? <Skeleton/> : query.isError ? <EstadoError error={query.error} retry={() => void query.refetch()}/> : <div className="stats-grid">{[
      {title: 'Pendientes', value: query.data.pendientes, icon: Clock3}, {title: 'En preparación', value: query.data.en_preparacion, icon: ChefHat},
      {title: 'Entregados', value: query.data.entregados, icon: CircleCheck}, {title: 'Cancelados', value: query.data.cancelados, icon: CircleX},
      {title: 'Pedidos de hoy', value: query.data.pedidos_hoy, icon: ShoppingBag}, {title: 'Ingresos por entregados', value: moneda(query.data.ingresos_entregados), icon: Wallet},
    ].map(s => <div key={s.title} className="card stat"><span className="stat-icon"><s.icon size={22}/></span><span>{s.title}</span><strong>{s.value}</strong></div>)}</div>}
    <p className="muted small">Los conteos por estado y los ingresos incluyen todo el historial. «Hoy» corresponde al día UTC. Los ingresos suman los pedidos entregados y no acreditan pagos bancarios.</p></>;
}
