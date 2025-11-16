// src/modules/venues/components/VenueImportOperations.tsx

import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaFileImport, FaHistory } from "react-icons/fa";

import ImportHistoryTable from "@common/components/ImportHistoryTable";
import ImportModal from "@common/components/ImportModal";
import {
    useGetVenueImportHistoryQuery,
    useImportEntitiesMutation,
} from "@common/api/importApi";

export function ImportVenuesButton() {
    const [showModal, setShowModal] = useState(false);
    const [importEntities] = useImportEntitiesMutation();

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaFileImport className="me-2" />
                Import Venues
            </Button>
            <ImportModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onImport={importEntities}
            />
        </>
    );
}

export function VenueImportHistoryModal() {
    const [show, setShow] = useState(false);
    const { data, isLoading, error } = useGetVenueImportHistoryQuery(undefined, {
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
                    <Modal.Title>Venue Import History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ImportHistoryTable data={data} isLoading={isLoading} error={error} />
                </Modal.Body>
            </Modal>
        </>
    );
}

