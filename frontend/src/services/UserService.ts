import { User, UserCreateDto, UserUpdateDto } from '../types/user';
import { Page } from '../types/shared';
import api from './api';


export const usersAPI = {
    getAll: async (page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sortBy,
            'sort.dir': sortDir
        });

        const response = await api.get(`/users?${params}`);
        return response.data as Page<User>;
    },

    getById: async (id: number) => {
        const response = await api.get(`/users/${id}`);
        return response.data as User;
    },

    create: async (user: UserCreateDto) => {
        const response = await api.post('/users', user);
        return response.data as User;
    },

    update: async (id: number, user: UserUpdateDto) => {
        const response = await api.put(`/users/${id}`, user);
        return response.data as User;
    },

    updateRole: async (id: number, role: string) => {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data as User;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
