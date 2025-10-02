import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type APIErrorResponse = {
    timestamp: string;
    error: string;
    title: string;
    details?: string | string[];
};

function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: () => ({}),
    refetchOnFocus: true,
    keepUnusedDataFor: 60,
});

export function parseError(error: unknown): string {
    if (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object'
    ) {
        const data = (error as any).data as Partial<APIErrorResponse>;
        if (Array.isArray(data.details)) return data.details.join('; ');
        if (typeof data.details === 'string') return data.details;
        if (data.title) return data.title;
    }
    return 'Unexpected error';
}




