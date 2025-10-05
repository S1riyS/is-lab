import { baseApi } from "@common/api/baseApi";
import type { Page, SearchParams } from "@common/api/types";

import type { PersonCreateDto, PersonDto, PersonUpdateDto } from "./types";

export const personsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPersons: build.query<
      Page<PersonDto>,
      SearchParams<PersonDto> | void
    >({
      query: (params) => ({
        url: "/persons",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
          sort: params?.sort,
        },
      }),
      providesTags: (r) => [{ type: "Persons", id: "LIST" }],
    }),
    createPerson: build.mutation<PersonDto, PersonCreateDto>({
      query: (body) => ({ url: "/persons", method: "POST", body }),
      invalidatesTags: [{ type: "Persons", id: "LIST" }],
    }),
    updatePerson: build.mutation<
      PersonDto,
      { id: number; body: PersonUpdateDto }
    >({
      query: ({ id, body }) => ({ url: `/persons/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Persons", id: "LIST" }],
    }),
    deletePerson: build.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/persons/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Persons", id: "LIST" }],
    }),
    getPerson: build.query<PersonDto, number>({
      query: (id) => ({ url: `/persons/${id}` }),
      providesTags: (result, error, id) => [{ type: "Persons", id }],
    }),
  }),
});

export const {
  useListPersonsQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
  useGetPersonQuery,
} = personsApi;
