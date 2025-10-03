export enum VenueType {
  OPEN_AREA = "OPEN_AREA",
  CINEMA = "CINEMA",
  STADIUM = "STADIUM",
}

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
