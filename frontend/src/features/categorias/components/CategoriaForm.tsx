import { Formulario } from '../../../shared/components/Formulario';
import type { Categoria } from '../types';
import { useGuardarCategoria } from '../hooks/useCategorias';
export function CategoriaForm({categoria, cerrar}: {categoria: Categoria | null; cerrar: () => void}) {
  const guardar = useGuardarCategoria();
  return <Formulario initial={{nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? ''}} campos={[
    {name: 'nombre', label: 'Nombre', required: true, minLength: 2, maxLength: 100}, {name: 'descripcion', label: 'Descripción', multiline: true}]}
    cancelar={cerrar} enviar={async v => {await guardar.mutateAsync({id: categoria?.id, data: {nombre: v.nombre, descripcion: v.descripcion || null}}); cerrar();}}/>;
}
