// src/modules/common/api/importApi.ts

import { baseApi } from "./baseApi";
import type { EntityType, ImportHistoryDto, ImportResultDto } from "./importTypes";

export const importApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Universal import endpoint
        importEntities: build.mutation<ImportResultDto, FormData>({
            query: (formData) => ({
                url: "/import",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, formData) => {
                // Invalidate appropriate tags based on entity type
                // We'll need to check the file content, but for now invalidate all
                return [
                    { type: "Tickets", id: "LIST" },
                    { type: "Tickets", id: "IMPORT_HISTORY" },
                    { type: "Events", id: "LIST" },
                    { type: "Events", id: "IMPORT_HISTORY" },
                    { type: "Venues", id: "LIST" },
                    { type: "Venues", id: "IMPORT_HISTORY" },
                    { type: "Persons", id: "LIST" },
                    { type: "Persons", id: "IMPORT_HISTORY" },
                    { type: "Locations", id: "LIST" },
                    { type: "Locations", id: "IMPORT_HISTORY" },
                    { type: "Coordinates", id: "LIST" },
                    { type: "Coordinates", id: "IMPORT_HISTORY" },
                ];
            },
        }),

        // Import history endpoints
        getTicketImportHistory: build.query<ImportHistoryDto[], void>({
            query: () => ({ url: "/import/history/TICKET" }),
            providesTags: [{ type: "Tickets", id: "IMPORT_HISTORY" }],
        }),

        getEventImportHistory: build.query<ImportHistoryDto[], void>({
            query: () => ({ url: "/import/history/EVENT" }),
            providesTags: [{ type: "Events", id: "IMPORT_HISTORY" }],
        }),

        getVenueImportHistory: build.query<ImportHistoryDto[], void>({
            query: () => ({ url: "/import/history/VENUE" }),
            providesTags: [{ type: "Venues", id: "IMPORT_HISTORY" }],
        }),

        getPersonImportHistory: build.query<ImportHistoryDto[], void>({
            query: () => ({ url: "/import/history/PERSON" }),
            providesTags: [{ type: "Persons", id: "IMPORT_HISTORY" }],
        }),

        getLocationImportHistory: build.query<ImportHistoryDto[], void>({
            query: () => ({ url: "/import/history/LOCATION" }),
            providesTags: [{ type: "Locations", id: "IMPORT_HISTORY" }],
        }),

        getCoordinatesImportHistory: build.query<ImportHistoryDto[], void>({
            query: () => ({ url: "/import/history/COORDINATES" }),
            providesTags: [{ type: "Coordinates", id: "IMPORT_HISTORY" }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useImportEntitiesMutation,
    useGetTicketImportHistoryQuery,
    useGetEventImportHistoryQuery,
    useGetVenueImportHistoryQuery,
    useGetPersonImportHistoryQuery,
    useGetLocationImportHistoryQuery,
    useGetCoordinatesImportHistoryQuery,
} = importApi;

