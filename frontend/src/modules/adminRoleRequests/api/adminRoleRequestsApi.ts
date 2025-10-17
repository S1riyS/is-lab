import { baseApi } from "@common/api/baseApi";
import type { Page, SearchParams } from "@common/api/types";

import type {
    AdminRoleRequestDto,
    AdminRoleRequestProcessDto,
    DeleteResponse,
} from "./types";

export const adminRoleRequestsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        listAdminRoleRequests: build.query<
            Page<AdminRoleRequestDto>,
            SearchParams<AdminRoleRequestDto> | void
        >({
            query: (params) => ({
                url: "/admin-role-requests",
                params: {
                    page: params?.page ?? 0,
                    size: params?.size ?? 10,
                    status: params?.search,
                    sort: params?.sort,
                },
            }),
            providesTags: (r) => [{ type: "AdminRoleRequests", id: "LIST" }],
        }),

        createAdminRoleRequest: build.mutation<AdminRoleRequestDto, void>({
            query: () => ({ url: "/admin-role-requests", method: "POST" }),
            invalidatesTags: [
                { type: "AdminRoleRequests", id: "LIST" },
                { type: "AdminRoleRequests", id: "MY_PENDING" },
            ],
        }),

        processAdminRoleRequest: build.mutation<
            AdminRoleRequestDto,
            { id: number; body: AdminRoleRequestProcessDto }
        >({
            query: ({ id, body }) => ({
                url: `/admin-role-requests/${id}/process`,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "AdminRoleRequests", id: "LIST" }],
        }),

        getMyPendingRequest: build.query<AdminRoleRequestDto | null, void>({
            query: () => ({ url: "/admin-role-requests/my-pending" }),
            providesTags: [{ type: "AdminRoleRequests", id: "MY_PENDING" }],
            transformResponse: (response: any) => {
                // The backend returns Optional, which comes as the value or null
                return response || null;
            },
        }),

        deleteAdminRoleRequest: build.mutation<DeleteResponse, number>({
            query: (id) => ({
                url: `/admin-role-requests/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "AdminRoleRequests", id: "LIST" }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useListAdminRoleRequestsQuery,
    useCreateAdminRoleRequestMutation,
    useProcessAdminRoleRequestMutation,
    useGetMyPendingRequestQuery,
    useDeleteAdminRoleRequestMutation,
} = adminRoleRequestsApi;

