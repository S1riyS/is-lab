import { Venue, VenueCreateDto, VenueUpdateDto } from '../types/venue';
import { Page } from '../types/shared';
import api from './api';


export const venuesAPI = {
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

        const response = await api.get(`/venues?${params}`);
        return response.data as Page<Venue>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/venues/${id}`);
        return response.data as Venue;
    },

    create: async (venue: VenueCreateDto) => {
        const response = await api.post('/venues', venue);
        return response.data as Venue;
    },

    update: async (id: number, venue: VenueUpdateDto) => {
        const response = await api.put(`/venues/${id}`, venue);
        return response.data as Venue;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/venues/${id}`);
        return response.data;
    }
};
