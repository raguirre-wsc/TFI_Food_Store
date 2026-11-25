import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import { Formulario } from '../../../shared/components/Formulario';
import { moneda } from '../../../shared/ui';
import { useCrearPedido } from '../hooks/usePedidos';
export function CheckoutPage() {
  const {items, total, vaciar} = useCartStore(); const crear = useCrearPedido(); const navigate = useNavigate();
  if (!items.length) return <div className="empty"><h1>Tu carrito está vacío</h1><Link className="btn" to="/">Elegir del menú</Link></div>;
  return <><div className="page-heading"><div><span className="eyebrow">Casi listo</span><h1>Confirmá tu pedido</h1><p>Contanos dónde lo recibís y cómo preferís pagar.</p></div></div><div className="checkout-grid"><section className="card"><h2>Entrega y pago</h2>
    <Formulario initial={{direccion_entrega: '', forma_pago: 'EFECTIVO', notas: ''}} campos={[
      {name: 'direccion_entrega', label: 'Dirección de entrega', required: true, minLength: 5, maxLength: 200},
      {name: 'forma_pago', label: 'Forma de pago', options: [{value: 'EFECTIVO', label: 'Efectivo'}, {value: 'TRANSFERENCIA', label: 'Transferencia'}]},
      {name: 'notas', label: 'Indicaciones adicionales (opcional)', multiline: true}]}
      texto="Confirmar pedido" enviar={async v => {const pedido = await crear.mutateAsync({items: items.map(i => ({producto_id: i.producto_id, cantidad: i.cantidad})), forma_pago: v.forma_pago === 'TRANSFERENCIA' ? 'TRANSFERENCIA' : 'EFECTIVO', direccion_entrega: v.direccion_entrega, notas: v.notas || null}); vaciar(); navigate('/mis-pedidos', {state: {nuevo: pedido.id}});}}/>
    <p className="muted small">El pago se coordina con el local. Esta aplicación no solicita datos bancarios ni procesa pagos.</p></section>
    <aside className="card order-summary"><span className="eyebrow">Tu selección</span><h2>Lo que vamos a preparar</h2>{items.map(i => <div className="summary-row" key={i.producto_id}><span>{i.cantidad} × {i.nombre}</span><strong>{moneda(i.cantidad*i.precio_unitario)}</strong></div>)}
      <div className="summary-total"><span>Total estimado</span><strong>{moneda(total())}</strong></div><p className="muted">El servidor confirma precios y stock. Si algo cambió, conservamos tu carrito para que puedas revisarlo.</p><Link className="text-link" to="/carrito">← Revisar carrito</Link></aside></div></>;
}
