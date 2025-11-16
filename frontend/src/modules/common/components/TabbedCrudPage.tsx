// src/modules/common/components/TabbedCrudPage.tsx
import { useState } from "react";
import { Stack, Tab, Tabs } from "react-bootstrap";

import type { CrudConfig } from "@common/types/crudConfig";
import { EntityType } from "../api/importTypes";

import CrudPage from "./CrudPage";
import ImportHistoryTable from "./ImportHistoryTable";

interface TabbedCrudPageProps<T extends { id: number }> {
    config: CrudConfig<T>;
    entityType: EntityType;
    useImportHistoryQuery: () => {
        data?: any[];
        isLoading: boolean;
        error?: any;
    };
}

export default function TabbedCrudPage<T extends { id: number }>({
    config,
    entityType,
    useImportHistoryQuery,
}: TabbedCrudPageProps<T>) {
    const [activeTab, setActiveTab] = useState<string>("contents");

    // Only fetch import history when on that tab
    const { data, isLoading, error } = useImportHistoryQuery();

    return (
        <Stack gap={3}>
            {/* Entity Name Header */}
            <h2>{config.entityName}s</h2>

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "contents")}
                className="mb-3"
            >
                {/* Contents Tab */}
                <Tab eventKey="contents" title="Contents">
                    <Stack gap={3}>
                        {/* Special Operations */}
                        {config.specialOperations &&
                            config.specialOperations.length > 0 && (
                                <div className="border rounded p-3 bg-light">
                                    <h5>Special Operations</h5>
                                    <Stack
                                        direction="horizontal"
                                        gap={2}
                                        className="flex-wrap"
                                    >
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

                        {/* Regular CRUD Page (without entity name header since it's in the parent) */}
                        <CrudPage config={config} hideTitle={true} />
                    </Stack>
                </Tab>

                {/* Import History Tab */}
                <Tab eventKey="import-history" title="Import History">
                    <div className="border rounded p-3">
                        <h5 className="mb-3">Import History for {config.entityName}s</h5>
                        <ImportHistoryTable
                            data={data}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </Tab>
            </Tabs>
        </Stack>
    );
}

