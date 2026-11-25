import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, LogOut, UtensilsCrossed } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui';
import { EstadoError } from '../components/Estados';
export function Navbar() {
  const {usuario, logout} = useAuthStore(); const cantidad = useCartStore(s => s.items.reduce((n, i) => n+i.cantidad, 0));
  const navigate = useNavigate(); const [error, setError] = useState<unknown>(null); const [saliendo, setSaliendo] = useState(false);
  return <><header className="navbar"><div className="nav-inner"><Link to="/" className="brand"><span className="brand-icon"><UtensilsCrossed size={22}/></span>food<span>store</span><i/></Link>
    <nav className="nav-links" aria-label="Navegación principal"><NavLink to="/" end>Menú</NavLink>{usuario && <NavLink to="/mis-pedidos">Mis pedidos</NavLink>}{usuario?.role === 'admin' && <NavLink to="/admin/resumen">Administración<ArrowUpRight size={13}/></NavLink>}</nav>
    <div className="nav-actions">{usuario ? <><span className="user-label">{usuario.full_name}<small>{usuario.role === 'admin' ? 'Administrador' : 'Cliente'}</small></span><Button className="btn-ghost icon-btn" aria-label="Cerrar sesión" title="Cerrar sesión" disabled={saliendo} onClick={async () => {setSaliendo(true); setError(null); try {await logout(); navigate('/login');} catch (e: unknown) {setError(e);} finally {setSaliendo(false);}}}><LogOut size={18}/></Button></> : <Link className="login-link" to="/login">Ingresar</Link>}
      <Link to="/carrito" className="btn cart-link"><ShoppingBag size={17}/><span>Mi carrito</span><b>{cantidad}</b></Link></div></div></header>{error !== null && <EstadoError error={error}/>}</>;
}
export function MainLayout() {return <><Navbar/><main className="main-container"><Outlet/></main><footer className="footer"><div><Link className="footer-brand" to="/">foodstore.</Link><span>Buena comida, buenos momentos.</span></div><p>Programación IV · TFI · Rodrigo Aguirre</p><span>Hecho para disfrutar.</span></footer></>;}
export function AdminLayout() {return <div className="admin-layout"><nav className="admin-nav" aria-label="Panel de administración"><span className="eyebrow">Tu negocio</span>{[['resumen', 'Resumen'], ['categorias', 'Categorías'], ['productos', 'Productos'], ['pedidos', 'Pedidos'], ['usuarios', 'Usuarios']].map(([url, label]) => <NavLink key={url} to={`/admin/${url}`}>{label}</NavLink>)}</nav><section className="admin-content"><Outlet/></section></div>;}
