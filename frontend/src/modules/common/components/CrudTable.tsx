// src/modules/common/components/CrudTable.tsx
import { ReactNode } from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowClick?: (row: T) => void;
  clickableRows?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  canEdit?: (row: T) => boolean;
  canDelete?: (row: T) => boolean;
};

export default function CrudTable<T extends { id?: number | string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onRowClick,
  clickableRows = false,
  onSort,
  sortColumn,
  sortDirection,
  canEdit,
  canDelete,
}: Props<T>) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className="px-3 py-2"
                style={{
                  cursor: c.sortable && onSort ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                onClick={() => {
                  if (c.sortable && onSort) {
                    const columnKey = String(c.key);
                    const newDirection =
                      sortColumn === columnKey && sortDirection === 'asc'
                        ? 'desc'
                        : 'asc';
                    onSort(columnKey, newDirection);
                  }
                }}
              >
                <div className="d-flex align-items-center gap-1">
                  <span>{c.header}</span>
                  {c.sortable && onSort && sortColumn === String(c.key) && (
                    <span className="text-muted">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-3 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row.id ?? Math.random())}
              onClick={
                clickableRows && onRowClick ? () => onRowClick(row) : undefined
              }
              style={{
                cursor: clickableRows && onRowClick ? "pointer" : "default",
              }}
            >
              {columns.map((c) => (
                <td key={String(c.key)} className="px-3 py-2">
                  {c.render ? c.render(row) : String((row as any)[c.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-3 py-2">
                  <div className="d-flex gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row);
                        }}
                        disabled={canEdit ? !canEdit(row) : false}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                        disabled={canDelete ? !canDelete(row) : false}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
