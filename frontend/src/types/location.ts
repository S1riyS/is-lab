import { BaseDto } from './shared';

export interface LocationDto extends BaseDto {
    x?: number;
    y: number;
    z: number;
    name?: string;
}

export interface LocationCreateDto {
    x?: number;
    y: number;
    z: number;
    name?: string;
}

export interface LocationUpdateDto {
    id: number;
    x?: number;
    y?: number;
    z?: number;
    name?: string;
}

// Legacy interface for backward compatibility
export interface Location extends LocationDto { }
