// src/modules/common/components/ImportHistoryTable.tsx

import { useState } from "react";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { format } from "date-fns";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

import type { ImportHistoryDto } from "../api/importTypes";

type ImportHistoryTableProps = {
    data?: ImportHistoryDto[];
    isLoading: boolean;
    error?: any;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/";

async function downloadImportFile(historyId: number, fileName?: string): Promise<void> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/import/history/${historyId}/download`, {
        method: "GET",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.details || errorData?.title || "Failed to download file");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "import.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export default function ImportHistoryTable({
    data,
    isLoading,
    error,
}: ImportHistoryTableProps) {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const handleDownload = async (item: ImportHistoryDto) => {
        setDownloadingId(item.id);
        try {
            await downloadImportFile(item.id, item.fileName);
            toast.success("File downloaded successfully");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to download file");
        } finally {
            setDownloadingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                Error loading import history: {error.data?.details || error.message || "Unknown error"}
            </Alert>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Alert variant="info">
                No import history available.
            </Alert>
        );
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Created Count</th>
                    <th>Date</th>
                    <th>File</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                            <Badge bg={item.status === "SUCCESS" ? "success" : "danger"}>
                                {item.status}
                            </Badge>
                        </td>
                        <td>{item.username}</td>
                        <td>{item.status === "SUCCESS" ? item.createdCount : "-"}</td>
                        <td>
                            {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")}
                        </td>
                        <td>
                            {item.filePath ? (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleDownload(item)}
                                    disabled={downloadingId === item.id}
                                    title={item.fileName || "Download file"}
                                >
                                    {downloadingId === item.id ? (
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <FaDownload />
                                    )}
                                    <span className="ms-1">
                                        {item.fileName ? item.fileName.substring(0, 20) + (item.fileName.length > 20 ? "..." : "") : "Download"}
                                    </span>
                                </Button>
                            ) : (
                                <span className="text-muted">-</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

