export enum TicketType {
  VIP = "VIP",
  USUAL = "USUAL",
  BUDGETARY = "BUDGETARY",
  CHEAP = "CHEAP",
}

export type TicketDto = {
  id: number;
  name: string;
  coordinatesId: number;
  creationDate: string; // Date
  personId: number;
  eventId?: number | null;
  price?: number | null; // Float
  type?: TicketType | null;
  discount: number; // 0..100
  number?: number | null;
  comment: string;
  venueId?: number | null;
  createdById?: number | null;
  updatedById?: number | null;
  updatedAt?: string | null; // Date
};

export type TicketCreateDto = {
  name: string;
  coordinatesId: number;
  creationDate?: string | null;
  personId: number;
  eventId?: number | null;
  price?: number | null;
  type?: TicketType | null;
  discount: number;
  number?: number | null;
  comment: string;
  venueId?: number | null;
};

export type TicketUpdateDto = Partial<Omit<TicketCreateDto, "discount">> & {
  discount?: number;
};

export type TicketGroupByNameResponse = [string, number][]; // [name, count]

export type CreateTicketWithDiscountRequest = {
  originalTicketId: number;
  discountPercent: number;
};

export type CancelEventRequest = {
  eventId: number;
};

export type DeleteResponse = {
  message: string;
};
