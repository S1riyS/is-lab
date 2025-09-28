import { BaseDto, TicketType } from './shared';

export interface TicketDto extends BaseDto {
    name: string;
    coordinatesId: number;
    creationDate: string;
    personId: number;
    eventId?: number;
    price: number;
    type?: TicketType;
    discount: number;
    number: number;
    comment: string;
    venueId?: number;
    createdById?: number;
    updatedById?: number;
    updatedAt?: string;
}

export interface TicketCreateDto {
    name: string;
    coordinatesId: number;
    creationDate: string;
    personId: number;
    eventId?: number;
    price: number;
    type?: TicketType;
    discount: number;
    number: number;
    comment: string;
    venueId?: number;
}

export interface TicketUpdateDto {
    id: number;
    name?: string;
    coordinatesId?: number;
    creationDate?: string;
    personId?: number;
    eventId?: number;
    price?: number;
    type?: TicketType;
    discount?: number;
    number?: number;
    comment?: string;
    venueId?: number;
}

// Legacy interface for backward compatibility
export interface Ticket extends TicketDto { }
