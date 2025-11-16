// src/modules/common/components/ImportModal.tsx

import { useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import type { ImportResultDto } from "../api/importTypes";
import { showErrorToast } from "../api/baseApi";

type ImportModalProps = {
    show: boolean;
    onHide: () => void;
    onImport: (formData: FormData) => Promise<{ data?: ImportResultDto; error?: any }>;
};

export default function ImportModal({
    show,
    onHide,
    onImport,
}: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ImportResultDto | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file to import");
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            // Validate JSON format (but don't modify the file)
            const fileContent = await file.text();
            try {
                JSON.parse(fileContent);
            } catch (parseError) {
                toast.error("Invalid JSON file format");
                setIsLoading(false);
                return;
            }

            // Create FormData with the original file
            const formData = new FormData();
            formData.append("file", file);

            const response = await onImport(formData);

            if (response.error) {
                showErrorToast(response.error);
                if (response.error.data?.errorMessage) {
                    setResult({
                        importId: 0,
                        status: "FAILED" as any,
                        errorMessage: response.error.data.errorMessage,
                    });
                }
            } else if (response.data) {
                setResult(response.data);
                if (response.data.status === "SUCCESS") {
                    toast.success(
                        `Successfully imported ${response.data.createdCount} entity(ies)`
                    );
                }
            }
        } catch (error) {
            showErrorToast(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Select JSON file</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                    </Form.Group>

                    {result && (
                        <Alert variant={result.status === "SUCCESS" ? "success" : "danger"}>
                            <Alert.Heading>
                                {result.status === "SUCCESS" ? "Import Successful" : "Import Failed"}
                            </Alert.Heading>
                            {result.status === "SUCCESS" ? (
                                <p>Successfully imported {result.createdCount} entity(ies).</p>
                            ) : (
                                <>
                                    <p>Import failed with the following error:</p>
                                    <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}>
                                        {result.errorMessage}
                                    </pre>
                                </>
                            )}
                        </Alert>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!file || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Importing...
                                </>
                            ) : (
                                "Import"
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

