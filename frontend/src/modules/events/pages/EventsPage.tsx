// src/modules/events/EventsPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";
import { renderDateTime } from "@common/utils/dateUtils";

import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useListEventsQuery,
  useUpdateEventMutation,
} from "../api/eventsApi";
import type { EventDto } from "../api/types";
import { eventFormFields } from "../config/eventFormConfig";

const eventsConfig: CrudConfig<EventDto> = {
  entityName: "Event",
  useListQuery: useListEventsQuery,
  useCreateMutation: useCreateEventMutation,
  useUpdateMutation: useUpdateEventMutation,
  useDeleteMutation: useDeleteEventMutation,
  columns: [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (row: EventDto) => renderDateTime(row.date),
    },
    { key: "minAge", header: "Min Age", sortable: true },
    { key: "description", header: "Description", sortable: true },
  ],
  formFields: eventFormFields,
};

export default function EventsPage() {
  return <CrudPage<EventDto> config={eventsConfig} />;
}
