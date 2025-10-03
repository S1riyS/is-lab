// src/modules/events/EventsPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";

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
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "date", header: "Date" },
    { key: "minAge", header: "Min Age" },
    { key: "description", header: "Description" },
  ],
  formFields: eventFormFields,
};

export default function EventsPage() {
  return <CrudPage<EventDto> config={eventsConfig} />;
}
