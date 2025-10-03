import { baseApi } from "@common/api/baseApi";

import type {
  CancelEventRequest,
  CreateTicketWithDiscountRequest,
  DeleteResponse,
  Page,
  TicketCreateDto,
  TicketDto,
  TicketGroupByNameResponse,
  TicketUpdateDto,
} from "./types";

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTickets: build.query<
      Page<TicketDto>,
      { page?: number; size?: number; search?: string } | void
    >({
      query: (params) => ({
        url: "/tickets",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
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
} = ticketsApi;
