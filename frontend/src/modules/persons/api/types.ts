export enum Color {
  RED = "RED",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  WHITE = "WHITE",
  BROWN = "BROWN",
}

export enum Country {
  USA = "USA",
  SPAIN = "SPAIN",
  SOUTH_KOREA = "SOUTH_KOREA",
  JAPAN = "JAPAN",
}

export type PersonDto = {
  id: number;
  eyeColor?: Color | null;
  hairColor?: Color | null;
  locationId: number;
  passportID: string;
  nationality: Country;
};

export type PersonCreateDto = {
  eyeColor?: Color | null;
  hairColor?: Color | null;
  locationId: number;
  passportID: string;
  nationality: Country;
};

export type PersonUpdateDto = Partial<PersonCreateDto>;
