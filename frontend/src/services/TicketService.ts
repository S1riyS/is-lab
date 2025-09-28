import { Ticket, TicketCreateDto, TicketUpdateDto } from '../types/ticket';
import { Page } from '../types/shared';
import api from './api';


export const ticketsAPI = {
    getAll: async (page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc', search?: string) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sortBy,
            'sort.dir': sortDir
        });

        if (search) {
            params.append('search', search);
        }

        const response = await api.get(`/tickets?${params}`);
        return response.data as Page<Ticket>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/tickets/${id}`);
        return response.data as Ticket;
    },

    create: async (ticket: TicketCreateDto) => {
        const response = await api.post('/tickets', ticket);
        return response.data as Ticket;
    },

    update: async (id: number, ticket: TicketUpdateDto) => {
        const response = await api.put(`/tickets/${id}`, ticket);
        return response.data as Ticket;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/tickets/${id}`);
        return response.data;
    },

    // Special operations
    groupByName: async () => {
        const response = await api.get('/tickets/special/group-by-name');
        return response.data;
    },

    getByCommentGreaterThan: async (comment: string) => {
        const response = await api.get(`/tickets/special/by-comment?comment=${encodeURIComponent(comment)}`);
        return response.data as Ticket[];
    },

    createWithDiscount: async (originalTicketId: number, discountPercent: number) => {
        const response = await api.post('/tickets/special/create-with-discount', null, {
            params: { originalTicketId, discountPercent }
        });
        return response.data as Ticket;
    },

    cancelEvent: async (eventId: number) => {
        const response = await api.post('/tickets/special/cancel-event', null, {
            params: { eventId }
        });
        return response.data;
    }
};
