import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
export function ProtectedRoute({roles}: {roles?: ('admin' | 'user')[]}) {
  const {usuario, cargando} = useAuthStore(); const location = useLocation();
  if (cargando) return <div className="empty" role="status">Verificando sesión…</div>;
  if (!usuario) return <Navigate to="/login" replace state={{from: location.pathname}}/>;
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/unauthorized" replace/>;
  return <Outlet/>;
}
