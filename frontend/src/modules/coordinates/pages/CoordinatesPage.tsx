// src/modules/coordinates/CoordinatesPage.tsx
import CrudPage from "@common/components/CrudPage";
import type { CrudConfig } from "@common/types/crudConfig";

import {
  useCreateCoordinatesMutation,
  useDeleteCoordinatesMutation,
  useListCoordinatesQuery,
  useUpdateCoordinatesMutation,
} from "../api/coordinatesApi";
import type { CoordinatesDto } from "../api/types";
import { coordinatesFormFields } from "../config/coordinatesFormConfig";

const coordinatesConfig: CrudConfig<CoordinatesDto> = {
  entityName: "Coordinates",
  useListQuery: useListCoordinatesQuery,
  useCreateMutation: useCreateCoordinatesMutation,
  useUpdateMutation: useUpdateCoordinatesMutation,
  useDeleteMutation: useDeleteCoordinatesMutation,
  columns: [
    { key: "id", header: "ID" },
    { key: "x", header: "X" },
    { key: "y", header: "Y" },
  ],
  formFields: coordinatesFormFields,
};

export default function CoordinatesPage() {
  return <CrudPage<CoordinatesDto> config={coordinatesConfig} />;
}
