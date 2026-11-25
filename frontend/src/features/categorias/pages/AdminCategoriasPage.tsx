import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Categoria } from '../types';
import { useCategorias, useEliminarCategoria } from '../hooks/useCategorias';
import { DataTable } from '../../../shared/components/DataTable';
import { EstadoError, Skeleton } from '../../../shared/components/Estados';
import { Button, Modal } from '../../../shared/ui';
import { CategoriaForm } from '../components/CategoriaForm';
export function AdminCategoriasPage() {
  const query = useCategorias(); const eliminar = useEliminarCategoria(); const [seleccion, setSeleccion] = useState<Categoria | null | undefined>(undefined);
  const [baja, setBaja] = useState<Categoria | null>(null);
  const columns: ColumnDef<Categoria>[] = [{accessorKey: 'nombre', header: 'Nombre'}, {accessorKey: 'descripcion', header: 'Descripción'},
    {id: 'acciones', header: 'Acciones', cell: ({row}) => <div className="actions"><Button className="btn-secondary btn-small" onClick={() => setSeleccion(row.original)}><Pencil size={14}/>Editar</Button>
      <Button className="btn-danger btn-small" onClick={() => {eliminar.reset(); setBaja(row.original);}}><Trash2 size={14}/>Dar de baja</Button></div>}];
  return <><div className="page-heading"><div><span className="eyebrow">Administración</span><h1>Categorías</h1><p>Organizá los sabores de tu catálogo.</p></div><Button onClick={() => setSeleccion(null)}><Plus size={18}/>Nueva categoría</Button></div>
    <div className="card">{query.isPending ? <Skeleton/> : query.isError ? <EstadoError error={query.error} retry={() => void query.refetch()}/> : <DataTable data={query.data} columns={columns}/>}</div>
    {seleccion !== undefined && <Modal title={seleccion ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setSeleccion(undefined)}><CategoriaForm categoria={seleccion} cerrar={() => setSeleccion(undefined)}/></Modal>}
    {baja && <Modal title="Dar de baja categoría" onClose={() => setBaja(null)}><p>Se retirará «{baja.nombre}» del listado de categorías. Sus productos seguirán visibles hasta que también se den de baja.</p>{eliminar.isError && <EstadoError error={eliminar.error}/>}
      <div className="actions form-actions"><Button className="btn-secondary" onClick={() => setBaja(null)}>Volver</Button><Button className="btn-danger" disabled={eliminar.isPending} onClick={() => eliminar.mutate(baja.id, {onSuccess: () => setBaja(null)})}>Confirmar baja</Button></div></Modal>}</>;
}
