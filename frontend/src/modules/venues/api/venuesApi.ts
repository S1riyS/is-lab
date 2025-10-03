import { baseApi } from "@common/api/baseApi";

import type { VenueCreateDto, VenueDto, VenueUpdateDto } from "./types";

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export const venuesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listVenues: build.query<
      Page<VenueDto>,
      { page?: number; size?: number; search?: string } | void
    >({
      query: (params) => ({
        url: "/venues",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
        },
      }),
      providesTags: (r) => [{ type: "Venues", id: "LIST" }],
    }),
    createVenue: build.mutation<VenueDto, VenueCreateDto>({
      query: (body) => ({ url: "/venues", method: "POST", body }),
      invalidatesTags: [{ type: "Venues", id: "LIST" }],
    }),
    updateVenue: build.mutation<VenueDto, { id: number; body: VenueUpdateDto }>(
      {
        query: ({ id, body }) => ({
          url: `/venues/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: [{ type: "Venues", id: "LIST" }],
      },
    ),
    deleteVenue: build.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/venues/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Venues", id: "LIST" }],
    }),
    getVenue: build.query<VenueDto, number>({
      query: (id) => ({ url: `/venues/${id}` }),
      providesTags: (result, error, id) => [{ type: "Venues", id }],
    }),
  }),
});

export const {
  useListVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
  useGetVenueQuery,
} = venuesApi;
