import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout, AdminLayout } from '../shared/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';
import { CatalogoPage } from '../features/productos/pages/CatalogoPage';
import { AdminProductosPage } from '../features/productos/pages/AdminProductosPage';
import { AdminCategoriasPage } from '../features/categorias/pages/AdminCategoriasPage';
import { CarritoPage } from '../features/pedidos/pages/CarritoPage';
import { CheckoutPage } from '../features/pedidos/pages/CheckoutPage';
import { MisPedidosPage } from '../features/pedidos/pages/MisPedidosPage';
import { AdminPedidosPage } from '../features/pedidos/pages/AdminPedidosPage';
import { AdminResumenPage } from '../features/pedidos/pages/AdminResumenPage';
import { AdminUsuariosPage } from '../features/usuarios/pages/AdminUsuariosPage';
export function AppRouter() {return <BrowserRouter><Routes><Route element={<MainLayout/>}>
  <Route index element={<CatalogoPage/>}/><Route path="login" element={<LoginPage/>}/><Route path="register" element={<RegisterPage/>}/><Route path="unauthorized" element={<UnauthorizedPage/>}/>
  <Route path="carrito" element={<CarritoPage/>}/><Route element={<ProtectedRoute/>}><Route path="checkout" element={<CheckoutPage/>}/><Route path="mis-pedidos" element={<MisPedidosPage/>}/></Route>
  <Route element={<ProtectedRoute roles={['admin']}/>}><Route path="admin" element={<AdminLayout/>}><Route index element={<Navigate to="resumen" replace/>}/>
    <Route path="resumen" element={<AdminResumenPage/>}/><Route path="categorias" element={<AdminCategoriasPage/>}/><Route path="productos" element={<AdminProductosPage/>}/><Route path="pedidos" element={<AdminPedidosPage/>}/><Route path="usuarios" element={<AdminUsuariosPage/>}/></Route></Route>
  <Route path="*" element={<div className="empty"><h1>No encontramos esa página.</h1><Link className="btn" to="/">Volver al menú</Link></div>}/>
</Route></Routes></BrowserRouter>;}
