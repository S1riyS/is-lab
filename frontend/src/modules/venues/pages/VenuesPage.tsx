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
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "capacity", header: "Capacity" },
    { key: "type", header: "Type" },
  ],
  formFields: venueFormFields,
};

export default function VenuesPage() {
  return <CrudPage<VenueDto> config={venuesConfig} />;
}
