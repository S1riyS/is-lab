import { baseApi } from "@common/api/baseApi";

import type {
  CoordinatesCreateDto,
  CoordinatesDto,
  CoordinatesUpdateDto,
} from "./types";

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export const coordinatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCoordinates: build.query<
      Page<CoordinatesDto>,
      { page?: number; size?: number; search?: string } | void
    >({
      query: (params) => ({
        url: "/coordinates",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
        },
      }),
      providesTags: (r) => [{ type: "Coordinates", id: "LIST" }],
    }),
    createCoordinates: build.mutation<CoordinatesDto, CoordinatesCreateDto>({
      query: (body) => ({ url: "/coordinates", method: "POST", body }),
      invalidatesTags: [{ type: "Coordinates", id: "LIST" }],
    }),
    updateCoordinates: build.mutation<
      CoordinatesDto,
      { id: number; body: CoordinatesUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `/coordinates/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Coordinates", id: "LIST" }],
    }),
    deleteCoordinates: build.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/coordinates/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Coordinates", id: "LIST" }],
    }),
    getCoordinates: build.query<CoordinatesDto, number>({
      query: (id) => ({ url: `/coordinates/${id}` }),
      providesTags: (result, error, id) => [{ type: "Coordinates", id }],
    }),
  }),
});

export const {
  useListCoordinatesQuery,
  useCreateCoordinatesMutation,
  useUpdateCoordinatesMutation,
  useDeleteCoordinatesMutation,
  useGetCoordinatesQuery,
} = coordinatesApi;
