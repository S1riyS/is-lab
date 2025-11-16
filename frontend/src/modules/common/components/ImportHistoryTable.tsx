// src/modules/common/components/ImportHistoryTable.tsx

import { Alert, Badge, Spinner, Table } from "react-bootstrap";
import { format } from "date-fns";

import type { ImportHistoryDto } from "../api/importTypes";

type ImportHistoryTableProps = {
    data?: ImportHistoryDto[];
    isLoading: boolean;
    error?: any;
};

export default function ImportHistoryTable({
    data,
    isLoading,
    error,
}: ImportHistoryTableProps) {
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
                    {/* <th>Error Message</th> */}
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
                        {/* <td>
                            {item.errorMessage ? (
                                <div
                                    style={{
                                        maxWidth: "300px",
                                        overflow: "auto",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    {item.errorMessage}
                                </div>
                            ) : (
                                "-"
                            )}
                        </td> */}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

