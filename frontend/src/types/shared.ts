// Base DTO interface
export interface BaseDto {
    id: number;
}

// Common enums
export enum TicketType {
    VIP = 'VIP',
    USUAL = 'USUAL',
    BUDGETARY = 'BUDGETARY',
    CHEAP = 'CHEAP'
}

export enum Color {
    RED = 'RED',
    YELLOW = 'YELLOW',
    ORANGE = 'ORANGE',
    WHITE = 'WHITE',
    BROWN = 'BROWN'
}

export enum Country {
    USA = 'USA',
    SPAIN = 'SPAIN',
    SOUTH_KOREA = 'SOUTH_KOREA',
    JAPAN = 'JAPAN'
}

export enum VenueType {
    OPEN_AREA = 'OPEN_AREA',
    CINEMA = 'CINEMA',
    STADIUM = 'STADIUM'
}

export enum UserRole {
    GUEST = 'GUEST',
    USER = 'USER',
    ADMIN = 'ADMIN'
}

// Common response interfaces
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// Spring Data Page interface
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Page<T> {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

// Legacy interface for backward compatibility (deprecated)
export interface PaginatedResponse<T> {
    tickets: T[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
