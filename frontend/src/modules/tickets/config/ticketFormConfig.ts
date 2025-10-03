// src/modules/tickets/config/ticketFormConfig.ts
import { FormFieldConfig } from "@common/types/formFieldConfig";

import { TicketType } from "../api/types";

export const ticketFormFields: FormFieldConfig<any>[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    required: true,
    maxLength: 100,
    placeholder: "Enter ticket name",
  },
  {
    key: "coordinatesId",
    label: "Coordinates",
    type: "entity-select",
    entityType: "coordinates",
    required: true,
  },
  {
    key: "personId",
    label: "Person",
    type: "entity-select",
    entityType: "person",
    required: true,
  },
  {
    key: "eventId",
    label: "Event",
    type: "entity-select",
    entityType: "event",
  },
  {
    key: "price",
    label: "Price",
    type: "number",
    min: 0,
    step: 0.01,
    placeholder: "0.00",
  },
  {
    key: "type",
    label: "Type",
    type: "select",
    options: [
      { value: TicketType.VIP, label: "VIP" },
      { value: TicketType.USUAL, label: "Usual" },
      { value: TicketType.BUDGETARY, label: "Budgetary" },
      { value: TicketType.CHEAP, label: "Cheap" },
    ],
    helpText: "Select the ticket type",
  },
  {
    key: "discount",
    label: "Discount (%)",
    type: "number",
    required: true,
    min: 0,
    max: 100,
    step: 1,
    placeholder: "0",
  },
  {
    key: "number",
    label: "Number",
    type: "number",
    min: 1,
    helpText: "Ticket number (optional)",
  },
  {
    key: "comment",
    label: "Comment",
    type: "textarea",
    required: true,
    rows: 3,
    maxLength: 500,
    placeholder: "Add any comments about this ticket",
  },
  {
    key: "venueId",
    label: "Venue",
    type: "entity-select",
    entityType: "venue",
    helpText: "Optional: Select the venue for this ticket",
  },
];
