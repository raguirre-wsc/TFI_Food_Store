import type { ColumnDef } from '@tanstack/react-table';
import { useUsuarios, useActivarUsuario } from '../hooks/useUsuarios';
import type { Usuario } from '../types';
import { useAuthStore } from '../../../store/authStore';
import { DataTable } from '../../../shared/components/DataTable';
import { EstadoError, Skeleton } from '../../../shared/components/Estados';
import { Button } from '../../../shared/ui';
export function AdminUsuariosPage() {
  const query = useUsuarios(); const cambiar = useActivarUsuario(); const usuario = useAuthStore(s => s.usuario);
  const columns: ColumnDef<Usuario>[] = [{accessorKey: 'username', header: 'Usuario'}, {accessorKey: 'full_name', header: 'Nombre'}, {accessorKey: 'email', header: 'Email'},
    {accessorKey: 'role', header: 'Rol'}, {accessorKey: 'disabled', header: 'Estado', cell: ({row}) => <span className={`badge ${row.original.disabled ? 'cancelado' : 'entregado'}`}>{row.original.disabled ? 'Desactivado' : 'Activo'}</span>},
    {id: 'acciones', header: 'Acciones', cell: ({row}) => usuario?.id === row.original.id ? <span className="muted small">Tu cuenta</span> : <Button className="btn-secondary btn-small" disabled={cambiar.isPending} onClick={() => cambiar.mutate({id: row.original.id, activo: row.original.disabled})}>{row.original.disabled ? 'Activar' : 'Desactivar'}</Button>}];
  return <><div className="page-heading"><div><span className="eyebrow">Administración</span><h1>Usuarios</h1><p>Administrá el acceso de las cuentas registradas.</p></div></div>
    {cambiar.isError && <EstadoError error={cambiar.error}/>}<div className="card">{query.isPending ? <Skeleton/> : query.isError ? <EstadoError error={query.error} retry={() => void query.refetch()}/> : <DataTable data={query.data} columns={columns}/>}</div></>;
}
