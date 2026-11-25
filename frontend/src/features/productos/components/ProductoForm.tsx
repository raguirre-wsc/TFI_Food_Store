import { Formulario } from '../../../shared/components/Formulario';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { EstadoError, Skeleton } from '../../../shared/components/Estados';
import type { Producto } from '../types';
import { useGuardarProducto, useStockProducto } from '../hooks/useProductos';
export function ProductoForm({producto: p, cerrar, soloStock = false}: {producto: Producto | null; cerrar: () => void; soloStock?: boolean}) {
  const categorias = useCategorias(); const guardar = useGuardarProducto(); const stock = useStockProducto();
  if (categorias.isPending) return <Skeleton/>;
  if (categorias.isError) return <EstadoError error={categorias.error} retry={() => void categorias.refetch()}/>;
  const opciones = categorias.data.map(c => ({value: String(c.id), label: c.nombre}));
  if (p && !opciones.some(c => c.value === String(p.categoria_id))) opciones.push({value: String(p.categoria_id), label: `${p.categoria.nombre} (dada de baja)`});
  return <Formulario initial={{nombre: p?.nombre ?? '', descripcion: p?.descripcion ?? '', precio_base: String(p?.precio_base ?? ''), imagen_url: p?.imagen_url ?? '', stock: String(p?.stock ?? 0), disponible: String(p?.disponible ?? true), categoria_id: String(p?.categoria_id ?? categorias.data[0]?.id ?? '')}}
    campos={[...(!soloStock ? [
      {name: 'nombre', label: 'Nombre', required: true, minLength: 2, maxLength: 100}, {name: 'descripcion', label: 'Descripción', multiline: true},
      {name: 'precio_base', label: 'Precio en pesos', type: 'number', min: 0, step: '0.01', required: true},
      {name: 'imagen_url', label: 'URL de imagen', type: 'url'}, {name: 'categoria_id', label: 'Categoría', required: true, options: [{value: '', label: 'Seleccioná una categoría'}, ...opciones]},
    ] : []), {name: 'stock', label: 'Stock en unidades', type: 'number', min: 0, step: '1', required: true},
      {name: 'disponible', label: 'Disponible para la venta', options: [{value: 'true', label: 'Sí'}, {value: 'false', label: 'No'}]}]}
    cancelar={cerrar} enviar={async v => {
      if (soloStock && p) await stock.mutateAsync({id: p.id, stock: Number(v.stock), disponible: v.disponible === 'true'});
      else {
        const data = {nombre: v.nombre, descripcion: v.descripcion || null, precio_base: Number(v.precio_base), imagen_url: v.imagen_url || null, stock: Number(v.stock), disponible: v.disponible === 'true', categoria_id: Number(v.categoria_id)};
        const {categoria_id, ...otros} = data;
        if (p) await guardar.mutateAsync({id: p.id, data: p.categoria_id === categoria_id ? otros : data});
        else await guardar.mutateAsync({data});
      }
      cerrar();
    }}/>;
}
