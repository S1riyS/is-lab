import { Coordinates, CoordinatesCreateDto, CoordinatesUpdateDto } from '../types/coordinates';
import { Page } from '../types/shared';
import api from './api';


export const coordinatesAPI = {
    getAll: async (page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sortBy,
            'sort.dir': sortDir
        });

        const response = await api.get(`/coordinates?${params}`);
        return response.data as Page<Coordinates>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/coordinates/${id}`);
        return response.data as Coordinates;
    },

    create: async (coordinates: CoordinatesCreateDto) => {
        const response = await api.post('/coordinates', coordinates);
        return response.data as Coordinates;
    },

    update: async (id: number, coordinates: CoordinatesUpdateDto) => {
        const response = await api.put(`/coordinates/${id}`, coordinates);
        return response.data as Coordinates;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/coordinates/${id}`);
        return response.data;
    }
};
