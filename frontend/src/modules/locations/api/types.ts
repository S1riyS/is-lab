export type LocationDto = {
  id: number;
  x?: number | null; // Long
  y: number; // Float
  z: number; // Long
  name?: string | null;
};

export type LocationCreateDto = {
  x?: number | null;
  y: number;
  z: number;
  name?: string | null;
};

export type LocationUpdateDto = Partial<LocationCreateDto>;
