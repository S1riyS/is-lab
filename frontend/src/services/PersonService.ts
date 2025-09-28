import { Person, PersonCreateDto, PersonUpdateDto } from '../types/person';
import { Page } from '../types/shared';
import api from './api';


export const personsAPI = {
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

        const response = await api.get(`/persons?${params}`);
        return response.data as Page<Person>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/persons/${id}`);
        return response.data as Person;
    },

    create: async (person: PersonCreateDto) => {
        const response = await api.post('/persons', person);
        return response.data as Person;
    },

    update: async (id: number, person: PersonUpdateDto) => {
        const response = await api.put(`/persons/${id}`, person);
        return response.data as Person;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/persons/${id}`);
        return response.data;
    }
};
