// src/modules/common/components/CrudPageWithSpecialOperations.tsx
import { Stack } from "react-bootstrap";

import type { CrudConfig } from "@common/types/crudConfig";

import CrudPage from "./CrudPage";

interface CrudPageWithSpecialOperationsProps<T extends { id: number }> {
  config: CrudConfig<T>;
}

export default function CrudPageWithSpecialOperations<
  T extends { id: number },
>({ config }: CrudPageWithSpecialOperationsProps<T>) {
  return (
    <Stack gap={3}>
      {/* Special Operations Header */}
      {config.specialOperations && config.specialOperations.length > 0 && (
        <div className="border rounded p-3 bg-light">
          <h5>Special Operations</h5>
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            {config.specialOperations.map((operation) => (
              <div key={operation.key}>
                {operation.renderModal ? (
                  operation.renderModal()
                ) : (
                  <button
                    type="button"
                    className={`btn btn-${operation.variant || "secondary"}`}
                    onClick={operation.onClick}
                  >
                    {operation.label}
                  </button>
                )}
              </div>
            ))}
          </Stack>
        </div>
      )}

      {/* Regular CRUD Page */}
      <CrudPage config={config} />
    </Stack>
  );
}
