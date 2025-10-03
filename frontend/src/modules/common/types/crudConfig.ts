// src/modules/common/types/crudConfig.ts
import { ReactNode } from "react";

import type { Column } from "@common/components/CrudTable";

import { FormFieldConfig } from "./formFieldConfig";

export interface SpecialOperation {
  key: string;
  label: string;
  type: "button" | "modal";
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  renderModal?: () => ReactNode;
  onClick?: () => void;
}

export interface CrudConfig<T extends { id: number }> {
  entityName: string;
  useListQuery: any;
  useCreateMutation: any;
  useUpdateMutation: any;
  useDeleteMutation: any;
  columns: Column<T>[];
  formFields: FormFieldConfig<T>[];
  // Add optional special operations
  specialOperations?: SpecialOperation[];
}
