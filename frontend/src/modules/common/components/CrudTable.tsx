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

export default function CrudTable<T extends { id?: number | string }>({ data, columns, onEdit, onDelete }: Props<T>) {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    {columns.map((c) => (
                        <th key={String(c.key)} style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>{c.header}</th>
                    ))}
                    {(onEdit || onDelete) && <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={String((row as any).id ?? Math.random())}>
                        {columns.map((c) => (
                            <td key={String(c.key)} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
                                {c.render ? c.render(row) : String((row as any)[c.key as any])}
                            </td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td style={{ borderBottom: '1px solid #eee', padding: 8, display: 'flex', gap: 8 }}>
                                {onEdit && <button onClick={() => onEdit(row)}>Edit</button>}
                                {onDelete && <button onClick={() => onDelete(row)}>Delete</button>}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}




