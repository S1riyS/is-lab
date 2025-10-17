import { baseApi } from "@common/api/baseApi";
import type { Page, SearchParams } from "@common/api/types";

import type {
  CancelEventRequest,
  CreateTicketWithDiscountRequest,
  DeleteResponse,
  DeleteTicketsByVenueRequest,
  TicketCreateDto,
  TicketDto,
  TicketGroupByNameResponse,
  TicketUpdateDto,
} from "./types";

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTickets: build.query<
      Page<TicketDto>,
      SearchParams<TicketDto> | void
    >({
      query: (params) => ({
        url: "/tickets",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
          sort: params?.sort,
        },
      }),
      providesTags: (r) => [{ type: "Tickets", id: "LIST" }],
    }),
    createTicket: build.mutation<TicketDto, TicketCreateDto>({
      query: (body) => ({ url: "/tickets", method: "POST", body }),
      invalidatesTags: [
        { type: "Tickets", id: "LIST" },
        { type: "Tickets", id: "GROUP" },
        { type: "Tickets", id: "COMMENT" },
      ],
    }),
    updateTicket: build.mutation<
      TicketDto,
      { id: number; body: TicketUpdateDto }
    >({
      query: ({ id, body }) => ({ url: `/tickets/${id}`, method: "PUT", body }),
      invalidatesTags: [
        { type: "Tickets", id: "LIST" },
        { type: "Tickets", id: "GROUP" },
        { type: "Tickets", id: "COMMENT" },
      ],
    }),
    deleteTicket: build.mutation<DeleteResponse, number>({
      query: (id) => ({ url: `/tickets/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Tickets", id: "LIST" },
        { type: "Tickets", id: "GROUP" },
        { type: "Tickets", id: "COMMENT" },
        { type: "Persons", id: "LIST" },
        { type: "Events", id: "LIST" },
        { type: "Venues", id: "LIST" },
        { type: "Coordinates", id: "LIST" },
      ],
    }),
    getTicket: build.query<TicketDto, number>({
      query: (id) => ({ url: `/tickets/${id}` }),
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
    }),

    // Special endpoints
    groupTicketsByName: build.query<TicketGroupByNameResponse, void>({
      query: () => ({ url: "/tickets/special/group-by-name" }),
      providesTags: [{ type: "Tickets", id: "GROUP" }],
    }),

    getTicketsByCommentGreaterThan: build.query<TicketDto[], string>({
      query: (comment) => ({
        url: "/tickets/special/by-comment",
        params: { comment },
      }),
      providesTags: [{ type: "Tickets", id: "COMMENT" }],
    }),

    createTicketWithDiscount: build.mutation<
      TicketDto,
      CreateTicketWithDiscountRequest
    >({
      query: ({ originalTicketId, discountPercent }) => ({
        url: "/tickets/special/create-with-discount",
        method: "POST",
        params: { originalTicketId, discountPercent },
      }),
      invalidatesTags: [
        { type: "Tickets", id: "LIST" },
        { type: "Tickets", id: "GROUP" },
      ],
    }),

    cancelEvent: build.mutation<DeleteResponse, CancelEventRequest>({
      query: ({ eventId }) => ({
        url: "/tickets/special/cancel-event",
        method: "POST",
        params: { eventId },
      }),
      invalidatesTags: [
        { type: "Tickets", id: "LIST" },
        { type: "Tickets", id: "GROUP" },
      ],
    }),

    deleteTicketsByVenue: build.mutation<
      DeleteResponse,
      DeleteTicketsByVenueRequest
    >({
      query: ({ venueId }) => ({
        url: "/tickets/special/delete-by-venue",
        method: "DELETE",
        params: { venueId },
      }),
      invalidatesTags: [
        { type: "Tickets", id: "LIST" },
        { type: "Tickets", id: "GROUP" },
        { type: "Tickets", id: "COMMENT" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketQuery,
  useGroupTicketsByNameQuery,
  useGetTicketsByCommentGreaterThanQuery,
  useCreateTicketWithDiscountMutation,
  useCancelEventMutation,
  useDeleteTicketsByVenueMutation,
} = ticketsApi;
