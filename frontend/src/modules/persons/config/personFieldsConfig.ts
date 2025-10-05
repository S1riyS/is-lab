// src/modules/persons/config/personFieldsConfig.ts
import { EntityField } from "@common/components/EntityDetail";

import { PersonDto } from "../api/types";

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
