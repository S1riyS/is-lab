export type VenueType = string; // mirror server enum

export type VenueDto = {
    id: number;
    name: string;
    capacity: number;
    type: VenueType;
};

export type VenueCreateDto = {
    name: string;
    capacity: number;
    type: VenueType;
};

export type VenueUpdateDto = Partial<VenueCreateDto>;


