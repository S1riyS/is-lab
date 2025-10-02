export type Color = string; // enum
export type Country = string; // enum

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


