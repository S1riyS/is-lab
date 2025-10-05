import { baseApi } from "@common/api/baseApi";
import type { Page, SearchParams } from "@common/api/types";

import type { EventCreateDto, EventDto, EventUpdateDto } from "./types";

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listEvents: build.query<
      Page<EventDto>,
      SearchParams<EventDto> | void
    >({
      query: (params) => ({
        url: "/events",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
          sort: params?.sort,
        },
      }),
      providesTags: (r) => [{ type: "Events", id: "LIST" }],
    }),
    createEvent: build.mutation<EventDto, EventCreateDto>({
      query: (body) => ({ url: "/events", method: "POST", body }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),
    updateEvent: build.mutation<EventDto, { id: number; body: EventUpdateDto }>(
      {
        query: ({ id, body }) => ({
          url: `/events/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [{ type: "Events", id: "LIST" }],
      },
    ),
    deleteEvent: build.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/events/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),
    getEvent: build.query<EventDto, number>({
      query: (id) => ({ url: `/events/${id}` }),
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),
  }),
});

export const {
  useListEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventQuery,
} = eventsApi;
