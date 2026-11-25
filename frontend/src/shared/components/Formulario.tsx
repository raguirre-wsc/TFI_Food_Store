import { useForm } from '@tanstack/react-form';
import { Button } from '../ui';
import { EstadoError } from './Estados';
import { useState } from 'react';

export interface Campo {
  name: string; label: string; type?: string; required?: boolean; minLength?: number; maxLength?: number;
  min?: number; step?: string; options?: {value: string; label: string}[]; multiline?: boolean;
  validate?: (value: string) => string | undefined;
}
export function Formulario({initial, campos, enviar, texto = 'Guardar cambios', cancelar}: {
  initial: Record<string, string>; campos: Campo[]; enviar: (v: Record<string, string>) => Promise<void>; texto?: string; cancelar?: () => void;
}) {
  const [error, setError] = useState<unknown>(null);
  const form = useForm({defaultValues: initial, onSubmit: async ({value}) => {
    setError(null); try { await enviar(value); } catch (e: unknown) { setError(e); }
  }});
  return <form className="form" onSubmit={event => {event.preventDefault(); event.stopPropagation(); void form.handleSubmit();}}>
    {campos.map(c => <form.Field key={c.name} name={c.name} validators={{onChange: ({value}) => {
      if (c.required && !value.trim()) return 'Este campo es obligatorio.';
      if (c.minLength && value.trim().length < c.minLength) return `Ingresá al menos ${c.minLength} caracteres.`;
      return c.validate?.(value);
    }}}>{field => <div><label htmlFor={`field-${c.name}`}>{c.label}</label>
      {c.options ? <select id={`field-${c.name}`} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} required={c.required}>
        {c.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : c.multiline ?
      <textarea id={`field-${c.name}`} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} maxLength={c.maxLength}/> :
      <input id={`field-${c.name}`} name={c.name} type={c.type ?? 'text'} value={field.state.value} onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)} required={c.required} minLength={c.minLength} maxLength={c.maxLength} min={c.min} step={c.step}
        autoComplete={c.name === 'password' ? 'current-password' : c.name === 'email' ? 'email' : c.name === 'username' ? 'username' : undefined}/>}
      {field.state.meta.errors.length > 0 && <p className="field-error">{field.state.meta.errors.join('. ')}</p>}</div>}</form.Field>)}
    {error !== null && <EstadoError error={error}/>}
    <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>{([canSubmit, submitting]) => <div className="actions form-actions">
      {cancelar && <Button type="button" className="btn-secondary" disabled={submitting} onClick={cancelar}>Volver</Button>}
      <Button type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Procesando…' : texto}</Button></div>}</form.Subscribe>
  </form>;
}
