import { baseApi } from "@common/api/baseApi";

import type { UserCreateDto, UserDto, UserUpdateDto } from "./types";

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listUsers: build.query<
      Page<UserDto>,
      { page?: number; size?: number; search?: string } | void
    >({
      query: (params) => ({
        url: "/users",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          search: params?.search,
        },
      }),
      providesTags: (r) => [{ type: "Users", id: "LIST" }],
    }),
    createUser: build.mutation<UserDto, UserCreateDto>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: build.mutation<UserDto, { id: number; body: UserUpdateDto }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: build.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
