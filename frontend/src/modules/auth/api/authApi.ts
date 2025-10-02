import { baseApi } from 'src/modules/common/api/baseApi';
import type { AuthenticationDto, UserDto } from '../state/authSlice';

export type LoginDto = { username: string; password: string };
export type RegisterDto = { username: string; password: string; role: string };

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<AuthenticationDto, LoginDto>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: build.mutation<AuthenticationDto, RegisterDto>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        current: build.query<UserDto, void>({
            query: () => ({ url: '/auth/current' }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useCurrentQuery } = authApi;




