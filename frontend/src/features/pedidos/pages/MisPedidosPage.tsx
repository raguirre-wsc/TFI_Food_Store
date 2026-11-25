import { useLocation } from 'react-router-dom';
import { ListaPedidos } from '../components/ListaPedidos';
import { CheckCircle2 } from 'lucide-react';
export function MisPedidosPage() {
  const location = useLocation(); const nuevo: unknown = (location.state as {nuevo?: unknown} | null)?.nuevo;
  return <><div className="page-heading"><div><span className="eyebrow">De nuestra cocina a tu mesa</span><h1>Mis pedidos</h1><p>Consultá el detalle y seguí la preparación de tu comida.</p></div></div>
    {typeof nuevo === 'number' && <div className="success" role="status"><CheckCircle2 size={22}/>¡Pedido #{nuevo} recibido! Ya está en nuestra lista.</div>}
    <ListaPedidos/></>;
}
