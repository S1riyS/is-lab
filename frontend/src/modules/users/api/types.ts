export type UserRole = string; // enum

export type UserDto = {
    id: number;
    username: string;
    role: UserRole;
    createdAt: string; // LocalDateTime
    isActive: boolean;
};

export type UserCreateDto = {
    username: string;
    password: string;
    role: UserRole;
};

export type UserUpdateDto = Partial<UserCreateDto> & { isActive?: boolean };


