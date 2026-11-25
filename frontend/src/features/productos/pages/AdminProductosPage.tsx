import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Producto } from '../types';
import { useProductos, useEliminarProducto } from '../hooks/useProductos';
import { DataTable } from '../../../shared/components/DataTable';
import { EstadoError, Skeleton } from '../../../shared/components/Estados';
import { Paginacion } from '../../../shared/components/Paginacion';
import { Button, Modal, moneda } from '../../../shared/ui';
import { ProductoForm } from '../components/ProductoForm';
export function AdminProductosPage() {
  const [skip, setSkip] = useState(0); const [search, setSearch] = useState(''); const query = useProductos({skip, limit: 100, search}); const eliminar = useEliminarProducto();
  const [seleccion, setSeleccion] = useState<Producto | null | undefined>(); const [soloStock, setSoloStock] = useState(false); const [baja, setBaja] = useState<Producto | null>(null);
  function editar(p: Producto | null, stock: boolean) {setSeleccion(p); setSoloStock(stock);}
  const columns: ColumnDef<Producto>[] = [{accessorKey: 'nombre', header: 'Producto'}, {accessorFn: p => p.categoria.nombre, id: 'categoria', header: 'Categoría'},
    {accessorKey: 'precio_base', header: 'Precio', cell: ({row}) => moneda(row.original.precio_base)}, {accessorKey: 'stock', header: 'Stock'},
    {accessorKey: 'disponible', header: 'Venta', cell: ({row}) => <span className={`badge ${row.original.disponible ? 'entregado' : 'cancelado'}`}>{row.original.disponible ? 'Disponible' : 'Pausado'}</span>},
    {id: 'acciones', header: 'Acciones', cell: ({row}) => <div className="actions"><Button className="btn-secondary btn-small" onClick={() => editar(row.original, false)}>Editar</Button><Button className="btn-secondary btn-small" onClick={() => editar(row.original, true)}>Stock</Button><Button className="btn-danger btn-small" onClick={() => {eliminar.reset(); setBaja(row.original);}}>Baja</Button></div>}];
  return <><div className="page-heading"><div><span className="eyebrow">Administración</span><h1>Productos</h1><p>Precios, existencias y disponibilidad.</p></div><Button onClick={() => editar(null, false)}><Plus size={18}/>Nuevo producto</Button></div>
    <label className="admin-search">Buscar producto<input type="search" value={search} onChange={e => {setSearch(e.target.value); setSkip(0);}}/></label>
    <div className="card">{query.isPending ? <Skeleton/> : query.isError ? <EstadoError error={query.error} retry={() => void query.refetch()}/> : <><DataTable data={query.data.items} columns={columns}/>{query.data.total > 100 && <Paginacion skip={skip} limit={100} total={query.data.total} cambiar={setSkip}/>}</>}</div>
    {seleccion !== undefined && <Modal title={soloStock ? 'Stock y disponibilidad' : seleccion ? 'Editar producto' : 'Nuevo producto'} onClose={() => setSeleccion(undefined)}><ProductoForm producto={seleccion} soloStock={soloStock} cerrar={() => setSeleccion(undefined)}/></Modal>}
    {baja && <Modal title="Dar de baja producto" onClose={() => setBaja(null)}><p>«{baja.nombre}» dejará de aparecer en el catálogo. Los pedidos existentes conservarán sus datos.</p>{eliminar.isError && <EstadoError error={eliminar.error}/>}
      <div className="actions form-actions"><Button className="btn-secondary" onClick={() => setBaja(null)}>Volver</Button><Button className="btn-danger" disabled={eliminar.isPending} onClick={() => eliminar.mutate(baja.id, {onSuccess: () => {setBaja(null); if (query.data?.items.length === 1 && skip) setSkip(Math.max(0, skip-100));}})}>Confirmar baja</Button></div></Modal>}</>;
}
