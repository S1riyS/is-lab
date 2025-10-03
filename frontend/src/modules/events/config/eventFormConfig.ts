// src/modules/events/config/eventFormConfig.ts
import { FormFieldConfig } from "@common/types/formFieldConfig";

export const eventFormFields: FormFieldConfig<any>[] = [
  {
    key: "name",
    label: "Event Name",
    type: "text",
    required: true,
    maxLength: 200,
    placeholder: "Enter event name",
  },
  {
    key: "date",
    label: "Event Date & Time",
    type: "datetime",
  },
  {
    key: "minAge",
    label: "Minimum Age",
    type: "number",
    min: 0,
    max: 120,
    step: 1,
    placeholder: "0",
    helpText: "Minimum age requirement (leave empty for no restriction)",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    required: true,
    rows: 4,
    maxLength: 1000,
    placeholder: "Describe the event...",
  },
];
