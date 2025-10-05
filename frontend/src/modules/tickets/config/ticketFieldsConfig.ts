// src/modules/tickets/config/ticketFieldsConfig.ts
import { EntityField } from "@common/components/EntityDetail";
import { renderDateTime } from "@common/utils/dateUtils";

import { TicketDto } from "../api/types";

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
    render: renderDateTime,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    value: ticket?.updatedAt,
    type: "date",
    render: renderDateTime,
  },
];
