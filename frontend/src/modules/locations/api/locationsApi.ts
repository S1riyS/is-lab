import { baseApi } from 'src/modules/common/api/baseApi';
import type { LocationDto, LocationCreateDto, LocationUpdateDto } from './types';

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export const locationsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        listLocations: build.query<Page<LocationDto>, { page?: number; size?: number; search?: string } | void>({
            query: (params) => ({ url: '/locations', params: { page: params?.page ?? 0, size: params?.size ?? 10, search: params?.search } }),
            providesTags: (r) => [{ type: 'Locations', id: 'LIST' }],
        }),
        createLocation: build.mutation<LocationDto, LocationCreateDto>({
            query: (body) => ({ url: '/locations', method: 'POST', body }),
            invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
        }),
        updateLocation: build.mutation<LocationDto, { id: number; body: LocationUpdateDto }>({
            query: ({ id, body }) => ({ url: `/locations/${id}`, method: 'PUT', body }),
            invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
        }),
        deleteLocation: build.mutation<{ message: string }, number>({
            query: (id) => ({ url: `/locations/${id}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
        }),
    }),
});

export const { useListLocationsQuery, useCreateLocationMutation, useUpdateLocationMutation, useDeleteLocationMutation } = locationsApi;


