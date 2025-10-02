import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserDto = {
    id: number;
    username: string;
    role: string;
};

export type AuthenticationDto = {
    token: string;
    user: UserDto;
};

type AuthState = {
    token: string | null;
    user: UserDto | null;
};

const initialState: AuthState = {
    token: localStorage.getItem('auth_token'),
    user: localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<AuthenticationDto>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('auth_token', action.payload.token);
            localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        },
        clearAuth(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;




