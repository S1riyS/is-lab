// src/modules/venues/VenuesPage.tsx
import TabbedCrudPage from "@common/components/TabbedCrudPage";
import type { CrudConfig } from "@common/types/crudConfig";
import { EntityType } from "@common/api/importTypes";
import { useGetVenueImportHistoryQuery } from "@common/api/importApi";

import type { VenueDto } from "../api/types";
import {
  useCreateVenueMutation,
  useDeleteVenueMutation,
  useListVenuesQuery,
  useUpdateVenueMutation,
} from "../api/venuesApi";
import { venueFormFields } from "../config/venueFormConfig";

const venuesConfig: CrudConfig<VenueDto> = {
  entityName: "Venue",
  useListQuery: useListVenuesQuery,
  useCreateMutation: useCreateVenueMutation,
  useUpdateMutation: useUpdateVenueMutation,
  useDeleteMutation: useDeleteVenueMutation,
  columns: [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "capacity", header: "Capacity", sortable: true },
    { key: "type", header: "Type", sortable: true },
  ],
  formFields: venueFormFields,
};

export default function VenuesPage() {
  return (
    <TabbedCrudPage<VenueDto>
      config={venuesConfig}
      entityType={EntityType.VENUE}
      useImportHistoryQuery={useGetVenueImportHistoryQuery}
    />
  );
}
