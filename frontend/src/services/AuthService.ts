import api from "./api";

export const authAPI = {
    register: async (username: string, password: string, role: string = 'USER') => {
        const response = await api.post('/auth/register', { username, password, role });
        return response.data;
    },

    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/current');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    }
};
