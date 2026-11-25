import { Link } from 'react-router-dom';
export function UnauthorizedPage() {return <div className="empty"><h1>Acceso restringido</h1><p>Tu cuenta no tiene permiso para entrar a esta sección.</p><Link className="btn" to="/">Volver al catálogo</Link></div>;}
