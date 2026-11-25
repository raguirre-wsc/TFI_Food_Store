import { useState } from 'react';
import { Plus, Check, Utensils } from 'lucide-react';
import type { Producto } from '../types';
import { Button, moneda } from '../../../shared/ui';
import { useCartStore } from '../../../store/cartStore';
export function ProductoCard({producto: p}: {producto: Producto}) {
  const agregar = useCartStore(s => s.agregar); const cantidad = useCartStore(s => s.items.find(i => i.producto_id === p.id)?.cantidad ?? 0);
  const [imagenError, setImagenError] = useState(false);
  const disponible = p.disponible && p.stock > cantidad;
  return <article className="product-card"><div className="product-image">{p.imagen_url && !imagenError ? <img src={p.imagen_url} alt={p.nombre} loading="lazy" onError={() => setImagenError(true)}/> : <div className="image-fallback"><Utensils size={40}/></div>}
    <span className="product-tag">{p.categoria.nombre}</span>{(!p.disponible || p.stock === 0) && <div className="unavailable">{p.stock === 0 ? 'Agotado por ahora' : 'No disponible'}</div>}</div>
    <div className="product-content"><h3>{p.nombre}</h3><p>{p.descripcion ?? 'Preparado en el momento, para disfrutar.'}</p><div className="muted">Stock disponible: {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}</div><div className="product-bottom"><strong>{moneda(p.precio_base)}</strong>
    <Button className="btn-small" disabled={!disponible} onClick={() => agregar({producto_id: p.id, nombre: p.nombre, precio_unitario: p.precio_base})}>{cantidad ? <Check size={16}/> : <Plus size={16}/>}{cantidad ? `Agregar · ${cantidad}` : 'Agregar'}</Button></div></div></article>;
}
