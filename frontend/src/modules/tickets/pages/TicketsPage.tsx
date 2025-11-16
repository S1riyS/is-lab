// src/modules/tickets/TicketsPage.tsx
import TabbedCrudPage from "@common/components/TabbedCrudPage";
import type { CrudConfig } from "@common/types/crudConfig";
import { EntityType } from "@common/api/importTypes";
import { useGetTicketImportHistoryQuery } from "@common/api/importApi";

import {
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useListTicketsQuery,
  useUpdateTicketMutation,
} from "../api/ticketsApi";
import { type TicketDto } from "../api/types";
import {
  CancelEventButton,
  CreateTicketWithDiscountModal,
  DeleteTicketsByVenueModal,
  GroupTicketsByNameModal,
  TicketsByCommentModal,
} from "../components/TicketSpecialOperations";
import { ticketFormFields } from "../config/ticketFormConfig";

const ticketsConfig: CrudConfig<TicketDto> = {
  entityName: "Ticket",
  useListQuery: useListTicketsQuery,
  useCreateMutation: useCreateTicketMutation,
  useUpdateMutation: useUpdateTicketMutation,
  useDeleteMutation: useDeleteTicketMutation,
  columns: [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "coordinatesId", header: "Coordinates ID", sortable: true },
    { key: "personId", header: "Person ID", sortable: true },
    { key: "eventId", header: "Event ID", sortable: true },
    { key: "price", header: "Price", sortable: true },
    { key: "type", header: "Type", sortable: true },
    { key: "discount", header: "Discount", sortable: true },
    { key: "number", header: "Number", sortable: true },
    { key: "comment", header: "Comment", sortable: true },
    { key: "venueId", header: "Venue ID", sortable: true },
  ],
  formFields: ticketFormFields,
  // Special operations (without import buttons)
  specialOperations: [
    {
      key: "group-by-name",
      label: "Group by Name",
      type: "modal",
      variant: "info",
      renderModal: () => <GroupTicketsByNameModal />,
    },
    {
      key: "by-comment",
      label: "Find by Comment",
      type: "modal",
      variant: "info",
      renderModal: () => <TicketsByCommentModal />,
    },
    {
      key: "create-with-discount",
      label: "Create with Discount",
      type: "modal",
      variant: "success",
      renderModal: () => <CreateTicketWithDiscountModal />,
    },
    {
      key: "cancel-event",
      label: "Cancel Event",
      type: "modal",
      variant: "warning",
      renderModal: () => <CancelEventButton />,
    },
    {
      key: "delete-by-venue",
      label: "Delete by Venue",
      type: "modal",
      variant: "danger",
      renderModal: () => <DeleteTicketsByVenueModal />,
    },
  ],
};

export default function TicketsPage() {
  return (
    <TabbedCrudPage<TicketDto>
      config={ticketsConfig}
      entityType={EntityType.TICKET}
      useImportHistoryQuery={useGetTicketImportHistoryQuery}
    />
  );
}
