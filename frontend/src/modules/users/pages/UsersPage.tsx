// src/modules/users/UsersPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";

import type { UserDto } from "../api/types";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useListUsersQuery,
  useUpdateUserMutation,
} from "../api/usersApi";

const usersConfig: CrudConfig<UserDto> = {
  entityName: "User",
  useListQuery: useListUsersQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useDeleteMutation: useDeleteUserMutation,
  columns: [
    { key: "id", header: "ID", sortable: true },
    { key: "username", header: "Username", sortable: true },
    { key: "role", header: "Role", sortable: true },
    { key: "createdAt", header: "Created", sortable: true },
    { key: "isActive", header: "Active", sortable: true },
  ],
  formFields: [
    {
      key: "username",
      label: "Username",
      type: "text",
      required: true,
      minLength: 3,
      maxLength: 50,
      placeholder: "Enter username",
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      required: true,
      minLength: 6,
      helpText: "Password must be at least 6 characters long",
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { value: "ADMIN", label: "Administrator" },
        { value: "USER", label: "User" },
        { value: "MODERATOR", label: "Moderator" },
      ],
      helpText: "Select the user role",
    },
    {
      key: "isActive",
      label: "Active User",
      type: "boolean",
      helpText: "Whether the user account is active",
    },
  ],
};

export default function UsersPage() {
  return <CrudPage<UserDto> config={usersConfig} />;
}
