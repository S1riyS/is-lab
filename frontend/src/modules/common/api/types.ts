// src/modules/common/api/types.ts

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export type SearchParams<T = any> = {
    page?: number;
    size?: number;
    search?: string;
    sort?: `${string & keyof T},${'asc' | 'desc'}`;
};
