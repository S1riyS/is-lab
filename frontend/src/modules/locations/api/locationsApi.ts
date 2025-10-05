import { baseApi } from "@common/api/baseApi";
import type { Page, SearchParams } from "@common/api/types";

import type {
  LocationCreateDto,
  LocationDto,
  LocationUpdateDto,
} from "./types";

export const locationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listLocations: build.query<
      Page<LocationDto>,
      SearchParams<LocationDto> | void
    >({
      query: (params) => ({
        url: "/locations",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
          sort: params?.sort,
        },
      }),
      providesTags: (r) => [{ type: "Locations", id: "LIST" }],
    }),
    createLocation: build.mutation<LocationDto, LocationCreateDto>({
      query: (body) => ({ url: "/locations", method: "POST", body }),
      invalidatesTags: [{ type: "Locations", id: "LIST" }],
    }),
    updateLocation: build.mutation<
      LocationDto,
      { id: number; body: LocationUpdateDto }
    >({
      query: ({ id, body }) => ({
        url: `/locations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Locations", id: "LIST" }],
    }),
    deleteLocation: build.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/locations/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Locations", id: "LIST" }],
    }),
    getLocation: build.query<LocationDto, number>({
      query: (id) => ({ url: `/locations/${id}` }),
      providesTags: (result, error, id) => [{ type: "Locations", id }],
    }),
  }),
});

export const {
  useListLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useGetLocationQuery,
} = locationsApi;
