import type { Categoria } from '../../categorias/types';
export interface Producto {id: number; categoria_id: number; nombre: string; descripcion: string | null; precio_base: number; imagen_url: string | null; stock: number; disponible: boolean; activo: boolean; categoria: Categoria}
export interface ProductoInput {nombre: string; descripcion: string | null; precio_base: number; imagen_url: string | null; stock: number; disponible: boolean; categoria_id: number}
export interface ProductosPaginados {total: number; items: Producto[]}
export interface ProductoFiltros {skip?: number; limit?: number; search?: string; categoria_id?: number; disponible?: boolean}
