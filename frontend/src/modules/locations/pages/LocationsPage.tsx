// src/modules/locations/LocationsPage.tsx
import TabbedCrudPage from "@common/components/TabbedCrudPage";
import type { CrudConfig } from "@common/types/crudConfig";
import { EntityType } from "@common/api/importTypes";
import { useGetLocationImportHistoryQuery } from "@common/api/importApi";

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
    { key: "id", header: "ID", sortable: true },
    { key: "x", header: "X", sortable: true },
    { key: "y", header: "Y", sortable: true },
    { key: "z", header: "Z", sortable: true },
    { key: "name", header: "Name", sortable: true },
  ],
  formFields: locationFormFields,
};

export default function LocationsPage() {
  return (
    <TabbedCrudPage<LocationDto>
      config={locationsConfig}
      entityType={EntityType.LOCATION}
      useImportHistoryQuery={useGetLocationImportHistoryQuery}
    />
  );
}
