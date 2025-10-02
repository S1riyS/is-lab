// src/modules/common/types/crudConfig.ts
import type { Column } from 'src/modules/common/components/CrudTable';

export interface CrudConfig<T> {
    entityName: string;
    columns: Column<T>[];
    formFields: Array<{
        key: keyof T;
        label: string;
        type: 'text' | 'number' | 'boolean';
    }>;

    useListQuery: (args: { page: number; size: number; search?: string }) => any;
    useCreateMutation: () => readonly [any, any];
    useUpdateMutation: () => readonly [any, any];
    useDeleteMutation: () => readonly [any, any];
}