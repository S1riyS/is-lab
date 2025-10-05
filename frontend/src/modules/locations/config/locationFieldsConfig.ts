// src/modules/locations/config/locationFieldsConfig.ts
import { EntityField } from "@common/components/EntityDetail";

import { LocationDto } from "../api/types";

export const createLocationFields = (location?: LocationDto): EntityField[] => [
  { key: "id", label: "ID", value: location?.id },
  { key: "name", label: "Name", value: location?.name },
  { key: "x", label: "X Coordinate", value: location?.x, type: "number" },
  { key: "y", label: "Y Coordinate", value: location?.y, type: "number" },
  { key: "z", label: "Z Coordinate", value: location?.z, type: "number" },
];
