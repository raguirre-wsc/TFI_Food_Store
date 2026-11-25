import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui';
import { EstadoVacio } from './Estados';
export function DataTable<T>({data, columns, paginar = true}: {data: T[]; columns: ColumnDef<T>[]; paginar?: boolean}) {
  const table = useReactTable({data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), manualPagination: !paginar, initialState: {pagination: {pageSize: 8}}});
  if (!data.length) return <EstadoVacio/>;
  return <><div className="table-wrap"><table><thead>{table.getHeaderGroups().map(group => <tr key={group.id}>
    {group.headers.map(header => <th key={header.id}>{header.isPlaceholder ? null : header.column.getCanSort() ?
      <button className="sort" onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())} {header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}</button> : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}</thead>
    <tbody>{table.getRowModel().rows.map(row => <tr key={row.id}>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table></div>
    {paginar && <div className="pagination"><span>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</span><div className="actions">
      <Button className="btn-secondary" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Anterior</Button>
      <Button className="btn-secondary" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Siguiente</Button></div></div>}</>;
}
