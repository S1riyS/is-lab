import { baseApi } from 'src/modules/common/api/baseApi';
import type { EventDto, EventCreateDto, EventUpdateDto } from './types';

export type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export const eventsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        listEvents: build.query<Page<EventDto>, { page?: number; size?: number; search?: string } | void>({
            query: (params) => ({ url: '/events', params: { page: params?.page ?? 0, size: params?.size ?? 10, search: params?.search } }),
            providesTags: (r) => [{ type: 'Events', id: 'LIST' }],
        }),
        createEvent: build.mutation<EventDto, EventCreateDto>({
            query: (body) => ({ url: '/events', method: 'POST', body }),
            invalidatesTags: [{ type: 'Events', id: 'LIST' }],
        }),
        updateEvent: build.mutation<EventDto, { id: number; body: EventUpdateDto }>({
            query: ({ id, body }) => ({ url: `/events/${id}`, method: 'PUT', body }),
            invalidatesTags: [{ type: 'Events', id: 'LIST' }],
        }),
        deleteEvent: build.mutation<{ message: string }, number>({
            query: (id) => ({ url: `/events/${id}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'Events', id: 'LIST' }],
        }),
    }),
});

export const { useListEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } = eventsApi;


