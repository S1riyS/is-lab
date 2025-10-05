// src/modules/venues/VenuesPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";

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
  return <CrudPage<VenueDto> config={venuesConfig} />;
}
