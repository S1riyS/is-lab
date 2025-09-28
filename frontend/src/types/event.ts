import { BaseDto } from './shared';

export interface EventDto extends BaseDto {
    name: string;
    date?: string;
    minAge: number;
    description: string;
}

export interface EventCreateDto {
    name: string;
    date?: string;
    minAge: number;
    description: string;
}

export interface EventUpdateDto {
    id: number;
    name?: string;
    date?: string;
    minAge?: number;
    description?: string;
}

// Legacy interface for backward compatibility
export interface Event extends EventDto { }
