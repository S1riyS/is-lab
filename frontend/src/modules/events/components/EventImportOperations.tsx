// src/modules/events/components/EventImportOperations.tsx

import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaFileImport, FaHistory } from "react-icons/fa";

import ImportHistoryTable from "@common/components/ImportHistoryTable";
import ImportModal from "@common/components/ImportModal";
import {
    useGetEventImportHistoryQuery,
    useImportEntitiesMutation,
} from "@common/api/importApi";

export function ImportEventsButton() {
    const [showModal, setShowModal] = useState(false);
    const [importEntities] = useImportEntitiesMutation();

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaFileImport className="me-2" />
                Import Events
            </Button>
            <ImportModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onImport={importEntities}
            />
        </>
    );
}

export function EventImportHistoryModal() {
    const [show, setShow] = useState(false);
    const { data, isLoading, error } = useGetEventImportHistoryQuery(undefined, {
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
                    <Modal.Title>Event Import History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImportHistoryTable data={data} isLoading={isLoading} error={error} />
                </Modal.Body>
            </Modal>
        </>
    );
}

