import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { Button, moneda } from '../../../shared/ui';
export function CarritoPage() {
  const {items, quitar, cambiarCantidad, total} = useCartStore();
  return <><div className="page-heading"><div><span className="eyebrow">Hecho para compartir</span><h1>Tu carrito</h1><p>Un paso más cerca de una buena comida.</p></div><Link to="/" className="text-link">Seguir eligiendo →</Link></div>
    {!items.length ? <div className="empty card"><ShoppingBag size={42}/><h2>Algo rico te está esperando.</h2><p>Sumá tus favoritos al carrito para empezar.</p><Link className="btn" to="/">Ver el menú</Link></div> :
    <div className="checkout-grid"><div className="card cart-lines">{items.map(i => <div className="cart-line" key={i.producto_id}><div><h3>{i.nombre}</h3><span className="muted">{moneda(i.precio_unitario)} por unidad</span></div>
      <label className="quantity">Cantidad<input aria-label={`Cantidad de ${i.nombre}`} type="number" min={1} step={1} value={i.cantidad} onChange={e => cambiarCantidad(i.producto_id, Number(e.target.value))}/></label>
      <strong>{moneda(i.cantidad * i.precio_unitario)}</strong><Button className="btn-ghost icon-btn" onClick={() => quitar(i.producto_id)} aria-label={`Quitar ${i.nombre}`}><Trash2 size={18}/></Button></div>)}</div>
      <aside className="card order-summary"><span className="eyebrow">Tu próxima comida</span><h2>Resumen</h2><div className="summary-row"><span>Productos</span><span>{items.reduce((n, i) => n+i.cantidad, 0)}</span></div><div className="summary-total"><span>Total estimado</span><strong>{moneda(total())}</strong></div>
        <p className="muted">El precio y el stock se confirman al realizar el pedido.</p><Link className="btn" to="/checkout">Continuar con el pedido<ArrowRight size={17}/></Link></aside></div>}</>;
}
