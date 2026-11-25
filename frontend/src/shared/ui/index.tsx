import { useEffect, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { EstadoPedido } from '../../features/pedidos/types';

export function Button({className = '', ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`btn ${className}`} {...props}/>;
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props}/>; }
export function Card({children, className = ''}: {children: ReactNode; className?: string}) {
  return <div className={`card ${className}`}>{children}</div>;
}
export function Modal({title, children, onClose}: {title: string; children: ReactNode; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} onCancel={onClose} onClick={event => {if (event.target === ref.current) onClose();}} aria-labelledby="modal-title">
    <div className="modal-heading"><h2 id="modal-title">{title}</h2><Button className="btn-ghost icon-btn" onClick={onClose} aria-label="Cerrar"><X size={20}/></Button></div>{children}</dialog>;
}
export const estados: Record<EstadoPedido, string> = {PENDIENTE: 'Pendiente', EN_PREPARACION: 'En preparación', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado'};
export function BadgeEstado({estado}: {estado: EstadoPedido}) { return <span className={`badge ${estado.toLowerCase()}`}>{estados[estado]}</span>; }
export const moneda = (n: number) => new Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS', maximumFractionDigits: 2}).format(n);
export const fecha = (s: string) => new Intl.DateTimeFormat('es-AR', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(/[Zz]|[+-]\d\d:\d\d$/.test(s) ? s : `${s}Z`));
