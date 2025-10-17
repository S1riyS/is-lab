import { toast } from "react-toastify";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type APIErrorResponse = {
  timestamp: string;
  error: string;
  title: string;
  details?: string | string[];
};

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Tickets",
    "Persons",
    "Locations",
    "Coordinates",
    "Events",
    "Venues",
    "Users",
    "AdminRoleRequests",
  ],
  endpoints: () => ({}),
  refetchOnFocus: true,
  keepUnusedDataFor: 60,
});

export function showErrorToast(error: unknown): void {
  let errorMessage = "Unexpected error";

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as any).data === "object"
  ) {
    const data = (error as any).data as Partial<APIErrorResponse>;
    if (Array.isArray(data.details)) errorMessage = data.details.join("; ");
    else if (typeof data.details === "string") errorMessage = data.details;
    else if (data.title) errorMessage = data.title;
  }

  toast.error(errorMessage);
}

export function showSuccessToast(message: string): void {
  toast.success(message);
}
