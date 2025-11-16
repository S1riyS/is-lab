// src/modules/locations/components/LocationImportOperations.tsx

import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaFileImport, FaHistory } from "react-icons/fa";

import ImportHistoryTable from "@common/components/ImportHistoryTable";
import ImportModal from "@common/components/ImportModal";
import {
    useGetLocationImportHistoryQuery,
    useImportEntitiesMutation,
} from "@common/api/importApi";

export function ImportLocationsButton() {
    const [showModal, setShowModal] = useState(false);
    const [importEntities] = useImportEntitiesMutation();

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaFileImport className="me-2" />
                Import Locations
            </Button>
            <ImportModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onImport={importEntities}
            />
        </>
    );
}

export function LocationImportHistoryModal() {
    const [show, setShow] = useState(false);
    const { data, isLoading, error } = useGetLocationImportHistoryQuery(undefined, {
        skip: !show,
    });

    return (
        <>
            <Button variant="info" onClick={() => setShow(true)}>
                <FaHistory className="me-2" />
                Import History
            </Button>
            <Modal show={show} onHide={() => setShow(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Location Import History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImportHistoryTable data={data} isLoading={isLoading} error={error} />
                </Modal.Body>
            </Modal>
        </>
    );
}

