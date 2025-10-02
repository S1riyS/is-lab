import { baseApi } from 'src/modules/common/api/baseApi';
import type { TicketDto, Page, TicketCreateDto, TicketUpdateDto } from './types';

export const ticketsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        listTickets: build.query<Page<TicketDto>, { page?: number; size?: number; search?: string } | void>({
            query: (params) => ({ url: '/tickets', params: { page: params?.page ?? 0, size: params?.size ?? 10, search: params?.search } }),
            providesTags: (r) => [{ type: 'Tickets', id: 'LIST' }],
        }),
        createTicket: build.mutation<TicketDto, TicketCreateDto>({
            query: (body) => ({ url: '/tickets', method: 'POST', body }),
            invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
        }),
        updateTicket: build.mutation<TicketDto, { id: number; body: TicketUpdateDto }>({
            query: ({ id, body }) => ({ url: `/tickets/${id}`, method: 'PUT', body }),
            invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
        }),
        deleteTicket: build.mutation<{ message: string }, number>({
            query: (id) => ({ url: `/tickets/${id}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'Tickets', id: 'LIST' }],
        }),
    }),
    overrideExisting: false,
});

export const { useListTicketsQuery, useCreateTicketMutation, useUpdateTicketMutation, useDeleteTicketMutation } = ticketsApi;




