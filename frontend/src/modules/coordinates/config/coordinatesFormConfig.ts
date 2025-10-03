// src/modules/coordinates/config/coordinatesFormConfig.ts
import { FormFieldConfig } from "@common/types/formFieldConfig";

export const coordinatesFormFields: FormFieldConfig<any>[] = [
  {
    key: "x",
    label: "X Coordinate",
    type: "number",
    max: 314,
    placeholder: "Enter X coordinate (max 314)",
    helpText: "Integer value up to 314",
  },
  {
    key: "y",
    label: "Y Coordinate",
    type: "number",
    required: true,
    step: 0.01,
    placeholder: "Enter Y coordinate (float)",
  },
];
