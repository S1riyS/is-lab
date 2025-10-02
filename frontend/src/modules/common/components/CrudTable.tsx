// src/modules/common/components/CrudTable.tsx
import { ReactNode } from 'react';

export type Column<T> = {
    key: keyof T | string;
    header: string;
    render?: (row: T) => ReactNode;
};

type Props<T> = {
    data: T[];
    columns: Column<T>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
};

export default function CrudTable<T extends { id?: number | string }>({
    data,
    columns,
    onEdit,
    onDelete,
}: Props<T>) {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={String(c.key)} className="px-3 py-2">
                                {c.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && <th className="px-3 py-2">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={String(row.id ?? Math.random())}>
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
                                                onClick={() => onEdit(row)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => onDelete(row)}
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