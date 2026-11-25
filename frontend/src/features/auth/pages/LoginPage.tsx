import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Formulario } from '../../../shared/components/Formulario';
import { useAuthStore } from '../../../store/authStore';
export function LoginPage() {
  const login = useAuthStore(s => s.login); const navigate = useNavigate(); const location = useLocation();
  const from: unknown = (location.state as {from?: unknown} | null)?.from;
  return <section className="auth-card card"><span className="eyebrow">Bienvenido de nuevo</span><h1>Tu próxima comida<br/>empieza acá.</h1><p>Ingresá para confirmar y seguir tus pedidos.</p>
    <Formulario initial={{username: '', password: ''}} campos={[{name: 'username', label: 'Usuario', required: true}, {name: 'password', label: 'Contraseña', type: 'password', required: true}]}
      texto="Iniciar sesión" enviar={async v => {await login(v.username, v.password); navigate(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/', {replace: true});}}/>
    <p className="auth-link">¿Todavía no tenés cuenta? <Link to="/register">Registrate</Link></p></section>;
}
