// src/modules/common/components/GlobalImportButton.tsx

import { useState } from "react";
import { Button } from "react-bootstrap";
import { FaFileImport } from "react-icons/fa";
import { useSelector } from "react-redux";

import ImportModal from "./ImportModal";
import { useImportEntitiesMutation } from "../api/importApi";
import { RootState } from "@store";

export default function GlobalImportButton() {
    const [showModal, setShowModal] = useState(false);
    const [importEntities] = useImportEntitiesMutation();
    const auth = useSelector((state: RootState) => state.auth);

    // Don't show button if user is not authenticated
    if (!auth.user) {
        return null;
    }

    return (
        <>
            <Button
                variant="success"
                size="sm"
                onClick={() => setShowModal(true)}
                className="me-2"
            >
                <FaFileImport className="me-1" />
                Import
            </Button>
            <ImportModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onImport={importEntities}
            />
        </>
    );
}

