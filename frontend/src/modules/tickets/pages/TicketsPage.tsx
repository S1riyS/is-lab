// src/modules/tickets/TicketsPage.tsx
import CrudPageWithSpecialOperations from "@common/components/CrudPageWithSpecialOperations";
import type { CrudConfig } from "@common/types/crudConfig";

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
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "coordinatesId", header: "Coordinates ID" },
    { key: "personId", header: "Person ID" },
    { key: "eventId", header: "Event ID" },
    { key: "price", header: "Price" },
    { key: "type", header: "Type" },
    { key: "discount", header: "Discount" },
    { key: "number", header: "Number" },
    { key: "comment", header: "Comment" },
    { key: "venueId", header: "Venue ID" },
  ],
  formFields: ticketFormFields,
  // Add special operations only for tickets
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
  ],
};

export default function TicketsPage() {
  return <CrudPageWithSpecialOperations<TicketDto> config={ticketsConfig} />;
}
