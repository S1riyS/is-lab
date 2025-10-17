export type EventDto = {
  id: number;
  name: string;
  date?: string | null; // ZonedDateTime
  minAge?: number | null;
  description?: string | null;
  createdByUserId?: number | null;
};

export type EventCreateDto = {
  name: string;
  date?: string | null;
  minAge?: number | null;
  description: string;
};

export type EventUpdateDto = Partial<EventCreateDto>;
