// src/modules/persons/PersonsPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";

import {
  useCreatePersonMutation,
  useDeletePersonMutation,
  useListPersonsQuery,
  useUpdatePersonMutation,
} from "../api/personsApi";
import { type PersonDto } from "../api/types";
import { personFormFields } from "../config/personFormConfig";

const personsConfig: CrudConfig<PersonDto> = {
  entityName: "Person",
  useListQuery: useListPersonsQuery,
  useCreateMutation: useCreatePersonMutation,
  useUpdateMutation: useUpdatePersonMutation,
  useDeleteMutation: useDeletePersonMutation,
  columns: [
    { key: "id", header: "ID" },
    { key: "eyeColor", header: "Eye Color" },
    { key: "hairColor", header: "Hair Color" },
    { key: "locationId", header: "Location ID" },
    { key: "passportID", header: "Passport ID" },
    { key: "nationality", header: "Nationality" },
  ],
  formFields: personFormFields,
};

export default function PersonsPage() {
  return <CrudPage<PersonDto> config={personsConfig} />;
}
