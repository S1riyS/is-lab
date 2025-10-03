// src/modules/persons/config/personFormConfig.ts
import { FormFieldConfig } from "@common/types/formFieldConfig";

import { Color, Country } from "../api/types";

const countriesOptions = [
  { value: Country.USA, label: "USA" },
  { value: Country.SPAIN, label: "Spain" },
  { value: Country.SOUTH_KOREA, label: "South Korea" },
  { value: Country.JAPAN, label: "Japan" },
];

const colorsOptions = [
  { value: Color.RED, label: "Red" },
  { value: Color.YELLOW, label: "Yellow" },
  { value: Color.ORANGE, label: "Orange" },
  { value: Color.WHITE, label: "White" },
  { value: Color.BROWN, label: "Brown" },
];

export const personFormFields: FormFieldConfig<any>[] = [
  {
    key: "eyeColor",
    label: "Eye Color",
    type: "select",
    options: colorsOptions,
  },
  {
    key: "hairColor",
    label: "Hair Color",
    type: "select",
    options: colorsOptions,
  },
  {
    key: "locationId",
    label: "Location",
    type: "entity-select",
    entityType: "location",
    required: true,
  },
  {
    key: "passportID",
    label: "Passport ID",
    type: "text",
    required: true,
    minLength: 5,
    maxLength: 20,
    placeholder: "Enter passport ID",
    helpText: "Must be between 10 and 28 characters",
  },
  {
    key: "nationality",
    label: "Nationality",
    type: "select",
    required: true,
    options: countriesOptions,
  },
];
