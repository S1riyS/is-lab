// src/modules/venues/config/venueFormConfig.ts
import { FormFieldConfig } from "@common/types/formFieldConfig";

import { VenueType } from "../api/types";

const venueTypeOptions = [
  { value: VenueType.OPEN_AREA, label: "Open Area" },
  { value: VenueType.CINEMA, label: "Cinema" },
  { value: VenueType.STADIUM, label: "Stadium" },
];

export const venueFormFields: FormFieldConfig<any>[] = [
  {
    key: "name",
    label: "Venue Name",
    type: "text",
    required: true,
    maxLength: 100,
    placeholder: "Enter venue name",
  },
  {
    key: "capacity",
    label: "Capacity",
    type: "number",
    required: true,
    min: 1,
    max: 100000,
    placeholder: "Enter venue capacity",
  },
  {
    key: "type",
    label: "Venue Type",
    type: "select",
    required: true,
    options: venueTypeOptions,
    helpText: "Select the type of venue",
  },
];
