// src/modules/coordinates/config/coordinatesFieldsConfig.ts
import { EntityField } from "@common/components/EntityDetail";

import { CoordinatesDto } from "../api/types";

export const createCoordinatesFields = (
  coordinates?: CoordinatesDto,
): EntityField[] => [
  { key: "id", label: "ID", value: coordinates?.id },
  { key: "x", label: "X Coordinate", value: coordinates?.x, type: "number" },
  { key: "y", label: "Y Coordinate", value: coordinates?.y, type: "number" },
];
