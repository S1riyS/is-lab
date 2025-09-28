import { Location, LocationCreateDto, LocationUpdateDto } from '../types/location';
import { Page } from '../types/shared';
import api from './api';

export const locationsAPI = {
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

        const response = await api.get(`/locations?${params}`);
        return response.data as Page<Location>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/locations/${id}`);
        return response.data as Location;
    },

    create: async (location: LocationCreateDto) => {
        const response = await api.post('/locations', location);
        return response.data as Location;
    },

    update: async (id: number, location: LocationUpdateDto) => {
        const response = await api.put(`/locations/${id}`, location);
        return response.data as Location;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/locations/${id}`);
        return response.data;
    }
};
