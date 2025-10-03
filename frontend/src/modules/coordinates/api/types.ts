export type CoordinatesDto = {
  id: number;
  x?: number | null; // Integer with max 314
  y: number; // Float
};

export type CoordinatesCreateDto = {
  x?: number | null;
  y: number;
};

export type CoordinatesUpdateDto = Partial<CoordinatesCreateDto>;
