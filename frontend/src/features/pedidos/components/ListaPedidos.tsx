import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { EstadoPedido, Pedido } from '../types';
import { usePedidos, useCancelarPedido, useCambiarEstadoPedido } from '../hooks/usePedidos';
import { DataTable } from '../../../shared/components/DataTable';
import { EstadoError, Skeleton } from '../../../shared/components/Estados';
import { Paginacion } from '../../../shared/components/Paginacion';
import { BadgeEstado, Button, Modal, estados, fecha, moneda } from '../../../shared/ui';
import { DetallePedido } from './DetallePedido';
export function ListaPedidos({admin = false}: {admin?: boolean}) {
  const [skip, setSkip] = useState(0); const [estado, setEstado] = useState<EstadoPedido | undefined>(); const [detalle, setDetalle] = useState<number | null>(null);
  const [confirmar, setConfirmar] = useState<{id: number; estado: EstadoPedido} | null>(null);
  const query = usePedidos(skip, estado); const cancelar = useCancelarPedido(); const cambiar = useCambiarEstadoPedido();
  const columns: ColumnDef<Pedido>[] = [{accessorKey: 'id', header: 'Pedido', cell: ({row}) => `#${String(row.original.id).padStart(4, '0')}`},
    {accessorKey: 'created_at', header: 'Fecha', cell: ({row}) => fecha(row.original.created_at)},
    ...(admin ? [{accessorKey: 'usuario_id', header: 'Cliente ID'}] : []),
    {accessorKey: 'estado', header: 'Estado', cell: ({row}) => <BadgeEstado estado={row.original.estado}/>}, {accessorKey: 'total', header: 'Total', cell: ({row}) => moneda(row.original.total)},
    {id: 'acciones', header: 'Acciones', cell: ({row}) => <div className="actions"><Button className="btn-secondary btn-small" onClick={() => setDetalle(row.original.id)}>Ver detalle</Button>
      {admin && ['PENDIENTE', 'EN_PREPARACION'].includes(row.original.estado) && <Button className="btn-small" onClick={() => {cambiar.reset(); setConfirmar({id: row.original.id, estado: row.original.estado === 'PENDIENTE' ? 'EN_PREPARACION' : 'ENTREGADO'});}}>{row.original.estado === 'PENDIENTE' ? 'Preparar' : 'Entregar'}</Button>}
      {(row.original.estado === 'PENDIENTE' || (admin && row.original.estado === 'EN_PREPARACION')) && <Button className="btn-danger btn-small" onClick={() => {cambiar.reset(); cancelar.reset(); setConfirmar({id: row.original.id, estado: 'CANCELADO'});}}>Cancelar</Button>}</div>}];
  return <><label className="admin-search">Filtrar por estado<select value={estado ?? ''} onChange={e => {setEstado(e.target.value ? e.target.value as EstadoPedido : undefined); setSkip(0);}}><option value="">Todos los estados</option>{Object.entries(estados).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
    <div className="card">{query.isPending ? <Skeleton/> : query.isError ? <EstadoError error={query.error} retry={() => void query.refetch()}/> : <><DataTable data={query.data.items} columns={columns} paginar={false}/><Paginacion skip={skip} limit={10} total={query.data.total} cambiar={setSkip}/></>}</div>
    {detalle !== null && <Modal title={`Detalle del pedido #${detalle}`} onClose={() => setDetalle(null)}><DetallePedido id={detalle}/></Modal>}
    {confirmar && <Modal title={confirmar.estado === 'CANCELADO' ? 'Cancelar pedido' : 'Cambiar estado'} onClose={() => setConfirmar(null)}><p>El pedido #{confirmar.id} pasará a «{estados[confirmar.estado]}».{confirmar.estado === 'CANCELADO' ? ' Se restituirá el stock y esta acción será definitiva.' : ''}</p>
      {(cancelar.isError || cambiar.isError) && <EstadoError error={cancelar.error ?? cambiar.error}/>}
      <div className="actions form-actions"><Button className="btn-secondary" onClick={() => setConfirmar(null)}>Volver</Button><Button disabled={cancelar.isPending || cambiar.isPending} onClick={() => {
        if (admin) cambiar.mutate(confirmar, {onSuccess: () => setConfirmar(null)}); else cancelar.mutate(confirmar.id, {onSuccess: () => setConfirmar(null)});
      }}>Confirmar</Button></div></Modal>}</>;
}
