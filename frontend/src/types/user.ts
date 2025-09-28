import { BaseDto, UserRole } from './shared';

export interface UserDto extends BaseDto {
    username: string;
    password?: string; // Only for create/update operations
    role: UserRole;
    createdAt?: string;
    isActive?: boolean;
}

export interface UserCreateDto {
    username: string;
    password: string;
    role: UserRole;
}

export interface UserUpdateDto {
    id: number;
    username?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
}

// Legacy interface for backward compatibility
export interface User extends UserDto { }
