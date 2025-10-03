// src/modules/common/utils/entityFields.ts
import { EntityField } from "@common/components/EntityDetail";
import { CoordinatesDto } from "@coordinates/api/types";
import { EventDto } from "@events/api/types";
import { LocationDto } from "@locations/api/types";
import { PersonDto } from "@persons/api/types";
import { TicketDto } from "@tickets/api/types";
import { VenueDto } from "@venues/api/types";

export const createTicketFields = (ticket?: TicketDto): EntityField[] => [
  { key: "id", label: "ID", value: ticket?.id },
  { key: "name", label: "Name", value: ticket?.name },
  { key: "price", label: "Price", value: ticket?.price, type: "number" },
  { key: "type", label: "Type", value: ticket?.type, type: "enum" },
  {
    key: "discount",
    label: "Discount (%)",
    value: ticket?.discount,
    type: "number",
  },
  { key: "number", label: "Number", value: ticket?.number, type: "number" },
  { key: "comment", label: "Comment", value: ticket?.comment },
  {
    key: "creationDate",
    label: "Creation Date",
    value: ticket?.creationDate,
    type: "date",
  },
  { key: "eventId", label: "Event ID", value: ticket?.eventId, type: "number" },
  { key: "venueId", label: "Venue ID", value: ticket?.venueId, type: "number" },
  {
    key: "createdById",
    label: "Created By ID",
    value: ticket?.createdById,
    type: "number",
  },
  {
    key: "updatedById",
    label: "Updated By ID",
    value: ticket?.updatedById,
    type: "number",
  },
  {
    key: "updatedAt",
    label: "Updated At",
    value: ticket?.updatedAt,
    type: "date",
  },
];

export const createPersonFields = (person?: PersonDto): EntityField[] => [
  { key: "id", label: "ID", value: person?.id },
  { key: "passportID", label: "Passport ID", value: person?.passportID },
  {
    key: "nationality",
    label: "Nationality",
    value: person?.nationality,
    type: "enum",
  },
  {
    key: "eyeColor",
    label: "Eye Color",
    value: person?.eyeColor,
    type: "enum",
  },
  {
    key: "hairColor",
    label: "Hair Color",
    value: person?.hairColor,
    type: "enum",
  },
];

export const createLocationFields = (location?: LocationDto): EntityField[] => [
  { key: "id", label: "ID", value: location?.id },
  { key: "name", label: "Name", value: location?.name },
  { key: "x", label: "X Coordinate", value: location?.x, type: "number" },
  { key: "y", label: "Y Coordinate", value: location?.y, type: "number" },
  { key: "z", label: "Z Coordinate", value: location?.z, type: "number" },
];

export const createCoordinatesFields = (
  coordinates?: CoordinatesDto,
): EntityField[] => [
  { key: "id", label: "ID", value: coordinates?.id },
  { key: "x", label: "X Coordinate", value: coordinates?.x, type: "number" },
  { key: "y", label: "Y Coordinate", value: coordinates?.y, type: "number" },
];

export const createEventFields = (event?: EventDto): EntityField[] => [
  { key: "id", label: "ID", value: event?.id },
  { key: "name", label: "Name", value: event?.name },
  { key: "date", label: "Date", value: event?.date, type: "date" },
  { key: "minAge", label: "Minimum Age", value: event?.minAge, type: "number" },
  { key: "description", label: "Description", value: event?.description },
];

export const createVenueFields = (venue?: VenueDto): EntityField[] => [
  { key: "id", label: "ID", value: venue?.id },
  { key: "name", label: "Name", value: venue?.name },
  {
    key: "capacity",
    label: "Capacity",
    value: venue?.capacity,
    type: "number",
  },
  { key: "type", label: "Type", value: venue?.type, type: "enum" },
];
