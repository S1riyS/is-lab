// src/modules/venues/config/venueFieldsConfig.ts
import { EntityField } from "@common/components/EntityDetail";

import { VenueDto } from "../api/types";

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
