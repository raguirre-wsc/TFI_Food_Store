import { useState } from 'react';
import { ArrowDown, Search, Bike, Leaf, ChefHat } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import { ProductoCard } from '../components/ProductoCard';
import { Skeleton, EstadoVacio, EstadoError } from '../../../shared/components/Estados';
import { Paginacion } from '../../../shared/components/Paginacion';
export function CatalogoPage() {
  const [search, setSearch] = useState(''); const [categoria, setCategoria] = useState<number | undefined>(); const [skip, setSkip] = useState(0);
  const categorias = useCategorias(); const productos = useProductos({skip, limit: 6, search, categoria_id: categoria});
  return <><section className="hero"><div className="hero-copy"><span className="hero-eyebrow"><span/>Hecho en el momento. Hecho para vos.</span><h1>Buena comida.<br/>Un buen <em>momento.</em></h1><p>Tus clásicos favoritos, ingredientes frescos y ese sabor<br className="desktop"/> que te hace volver. Elegí, pedí y disfrutá.</p>
    <a className="btn hero-button" href="#menu">Explorar el menú <ArrowDown size={17}/></a><div className="hero-benefits"><span><ChefHat size={16}/>Cocina de la casa</span><span><Bike size={16}/>A tu puerta</span></div></div>
    <div className="hero-visual"><div className="hero-circle"/><img src="/images/clasica.jpg" alt="Hamburguesa de la casa con vegetales frescos"/><div className="hero-note"><Leaf size={22}/><div><strong>El sabor está en los detalles</strong><span>Ingredientes que hacen la diferencia.</span></div></div><span className="hero-stamp">SABOR DE<br/><b>CASA</b><br/>FOOD STORE</span></div></section>
    <section id="menu" className="menu-section"><div className="page-heading"><div><span className="eyebrow">Encontrá tu favorito</span><h2>Nuestro menú</h2><p>Lo que te gusta, recién hecho.</p></div><label className="search-box"><Search size={19}/><input aria-label="Buscar en el menú" type="search" placeholder="¿Qué se te antoja?" value={search} onChange={e => {setSearch(e.target.value); setSkip(0);}}/></label></div>
    <div className="category-tabs"><button className={!categoria ? 'active' : ''} onClick={() => {setCategoria(undefined); setSkip(0);}}>Todo el menú</button>{categorias.data?.map(c => <button key={c.id} className={categoria === c.id ? 'active' : ''} onClick={() => {setCategoria(c.id); setSkip(0);}}>{c.nombre}</button>)}</div>
    {categorias.isError && <EstadoError error={categorias.error} retry={() => void categorias.refetch()}/>}
    {productos.isPending ? <Skeleton/> : productos.isError ? <EstadoError error={productos.error} retry={() => void productos.refetch()}/> : <>
      {productos.data.items.length ? <div className="product-grid">{productos.data.items.map(p => <ProductoCard key={p.id} producto={p}/>)}</div> : <EstadoVacio texto="No encontramos productos. Probá con otra búsqueda o categoría."/>}
      <Paginacion skip={skip} limit={6} total={productos.data.total} cambiar={setSkip}/></>}</section></>;
}
