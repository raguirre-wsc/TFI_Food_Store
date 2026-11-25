import { Link, useNavigate } from 'react-router-dom';
import { Formulario } from '../../../shared/components/Formulario';
import { authApi } from '../api/auth';
import { useAuthStore } from '../../../store/authStore';
export function RegisterPage() {
  const navigate = useNavigate(); const login = useAuthStore(s => s.login);
  return <section className="auth-card card"><span className="eyebrow">Un lugar en nuestra mesa</span><h1>Creá tu cuenta.</h1><p>Elegí tus favoritos y nosotros nos encargamos de cocinar.</p>
    <Formulario initial={{username: '', full_name: '', email: '', password: ''}} campos={[
      {name: 'full_name', label: 'Nombre completo', required: true, minLength: 2, maxLength: 100},
      {name: 'username', label: 'Usuario', required: true, minLength: 3, maxLength: 50, validate: v => /^[a-zA-Z0-9_.-]+$/.test(v) ? undefined : 'Usá letras, números, punto, guion o guion bajo.'},
      {name: 'email', label: 'Email', type: 'email', required: true}, {name: 'password', label: 'Contraseña', type: 'password', required: true, minLength: 8, maxLength: 72}]}
      texto="Crear cuenta" enviar={async v => {await authApi.register({username: v.username, full_name: v.full_name, email: v.email, password: v.password}); await login(v.username, v.password); navigate('/');}}/>
    <p className="auth-link">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p></section>;
}
