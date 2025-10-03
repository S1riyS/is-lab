// src/modules/locations/config/locationFormConfig.ts
import { FormFieldConfig } from "@common/types/formFieldConfig";

export const locationFormFields: FormFieldConfig<any>[] = [
  {
    key: "x",
    label: "X Coordinate",
    type: "number",
    placeholder: "Enter X coordinate (Long)",
  },
  {
    key: "y",
    label: "Y Coordinate",
    type: "number",
    required: true,
    step: 0.01,
    placeholder: "Enter Y coordinate (float)",
  },
  {
    key: "z",
    label: "Z Coordinate",
    type: "number",
    required: true,
    placeholder: "Enter Z coordinate (Long)",
  },
  {
    key: "name",
    label: "Location Name",
    type: "text",
    maxLength: 100,
    placeholder: "Enter location name (optional)",
  },
];
