import { Event, EventCreateDto, EventUpdateDto } from '../types/event';
import { Page } from '../types/shared';
import api from './api';

export const eventsAPI = {
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

        const response = await api.get(`/events?${params}`);
        return response.data as Page<Event>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/events/${id}`);
        return response.data as Event;
    },

    create: async (event: EventCreateDto) => {
        const response = await api.post('/events', event);
        return response.data as Event;
    },

    update: async (id: number, event: EventUpdateDto) => {
        const response = await api.put(`/events/${id}`, event);
        return response.data as Event;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    }
};
