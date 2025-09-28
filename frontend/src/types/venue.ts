import { BaseDto, VenueType } from './shared';

export interface VenueDto extends BaseDto {
    name: string;
    capacity: number;
    type: VenueType;
}

export interface VenueCreateDto {
    name: string;
    capacity: number;
    type: VenueType;
}

export interface VenueUpdateDto {
    id: number;
    name?: string;
    capacity?: number;
    type?: VenueType;
}

// Legacy interface for backward compatibility
export interface Venue extends VenueDto { }
