// src/modules/events/config/eventFieldsConfig.ts
import { EntityField } from "@common/components/EntityDetail";
import { renderDateTime } from "@common/utils/dateUtils";

import { EventDto } from "../api/types";

export const createEventFields = (event?: EventDto): EntityField[] => [
  { key: "id", label: "ID", value: event?.id },
  { key: "name", label: "Name", value: event?.name },
  {
    key: "date",
    label: "Date",
    value: event?.date,
    type: "date",
    render: renderDateTime,
  },
  { key: "minAge", label: "Minimum Age", value: event?.minAge, type: "number" },
  { key: "description", label: "Description", value: event?.description },
];
