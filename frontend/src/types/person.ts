import { BaseDto, Color, Country } from './shared';

export interface PersonDto extends BaseDto {
    eyeColor?: Color;
    hairColor?: Color;
    locationId: number;
    passportID: string;
    nationality: Country;
}

export interface PersonCreateDto {
    eyeColor?: Color;
    hairColor?: Color;
    locationId: number;
    passportID: string;
    nationality: Country;
}

export interface PersonUpdateDto {
    id: number;
    eyeColor?: Color;
    hairColor?: Color;
    locationId?: number;
    passportID?: string;
    nationality?: Country;
}

// Legacy interface for backward compatibility
export interface Person extends PersonDto { }
