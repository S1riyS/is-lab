// src/modules/persons/PersonsPage.tsx
import TabbedCrudPage from "@common/components/TabbedCrudPage";
import type { CrudConfig } from "@common/types/crudConfig";
import { EntityType } from "@common/api/importTypes";
import { useGetPersonImportHistoryQuery } from "@common/api/importApi";

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
    { key: "id", header: "ID", sortable: true },
    { key: "eyeColor", header: "Eye Color", sortable: true },
    { key: "hairColor", header: "Hair Color", sortable: true },
    { key: "locationId", header: "Location ID", sortable: true },
    { key: "passportID", header: "Passport ID", sortable: true },
    { key: "nationality", header: "Nationality", sortable: true },
  ],
  formFields: personFormFields,
};

export default function PersonsPage() {
  return (
    <TabbedCrudPage<PersonDto>
      config={personsConfig}
      entityType={EntityType.PERSON}
      useImportHistoryQuery={useGetPersonImportHistoryQuery}
    />
  );
}
