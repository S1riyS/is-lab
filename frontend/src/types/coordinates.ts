import { BaseDto } from './shared';

export interface CoordinatesDto extends BaseDto {
    x?: number;
    y: number;
}

export interface CoordinatesCreateDto {
    x?: number;
    y: number;
}

export interface CoordinatesUpdateDto {
    id: number;
    x?: number;
    y?: number;
}

// Legacy interface for backward compatibility
export interface Coordinates extends CoordinatesDto { }
