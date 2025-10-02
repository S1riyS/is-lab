import { baseApi } from 'src/modules/common/api/baseApi';
import type { PersonDto, PersonCreateDto, PersonUpdateDto } from './types';

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export const personsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        listPersons: build.query<Page<PersonDto>, { page?: number; size?: number; search?: string } | void>({
            query: (params) => ({ url: '/persons', params: { page: params?.page ?? 0, size: params?.size ?? 10, search: params?.search } }),
            providesTags: (r) => [{ type: 'Persons', id: 'LIST' }],
        }),
        createPerson: build.mutation<PersonDto, PersonCreateDto>({
            query: (body) => ({ url: '/persons', method: 'POST', body }),
            invalidatesTags: [{ type: 'Persons', id: 'LIST' }],
        }),
        updatePerson: build.mutation<PersonDto, { id: number; body: PersonUpdateDto }>({
            query: ({ id, body }) => ({ url: `/persons/${id}`, method: 'PUT', body }),
            invalidatesTags: [{ type: 'Persons', id: 'LIST' }],
        }),
        deletePerson: build.mutation<{ message: string }, number>({
            query: (id) => ({ url: `/persons/${id}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'Persons', id: 'LIST' }],
        }),
    }),
});

export const { useListPersonsQuery, useCreatePersonMutation, useUpdatePersonMutation, useDeletePersonMutation } = personsApi;


