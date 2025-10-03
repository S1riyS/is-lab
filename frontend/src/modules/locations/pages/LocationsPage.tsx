// src/modules/locations/LocationsPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";

import {
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useListLocationsQuery,
  useUpdateLocationMutation,
} from "../api/locationsApi";
import type { LocationDto } from "../api/types";
import { locationFormFields } from "../config/locationFormConfig";

const locationsConfig: CrudConfig<LocationDto> = {
  entityName: "Location",
  useListQuery: useListLocationsQuery,
  useCreateMutation: useCreateLocationMutation,
  useUpdateMutation: useUpdateLocationMutation,
  useDeleteMutation: useDeleteLocationMutation,
  columns: [
    { key: "id", header: "ID" },
    { key: "x", header: "X" },
    { key: "y", header: "Y" },
    { key: "z", header: "Z" },
    { key: "name", header: "Name" },
  ],
  formFields: locationFormFields,
};

export default function LocationsPage() {
  return <CrudPage<LocationDto> config={locationsConfig} />;
}
