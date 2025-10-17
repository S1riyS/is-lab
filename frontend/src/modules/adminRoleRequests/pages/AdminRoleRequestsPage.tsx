import { useState } from "react";

import {
    Alert,
    Badge,
    Button,
    Col,
    Form,
    InputGroup,
    Modal,
    Row,
    Stack,
    Table,
} from "react-bootstrap";
import { toast } from "react-toastify";

import { showErrorToast } from "@common/api/baseApi";

import {
    useDeleteAdminRoleRequestMutation,
    useListAdminRoleRequestsQuery,
    useProcessAdminRoleRequestMutation,
} from "../api/adminRoleRequestsApi";
import { AdminRoleRequestDto, AdminRoleRequestStatus } from "../api/types";

export default function AdminRoleRequestsPage() {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");

    const { data, isLoading, refetch } = useListAdminRoleRequestsQuery({
        page,
        size,
        search: statusFilter || undefined,
    });

    const [processRequest] = useProcessAdminRoleRequestMutation();
    const [deleteRequest] = useDeleteAdminRoleRequestMutation();

    const [showProcessModal, setShowProcessModal] = useState<AdminRoleRequestDto | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isApproving, setIsApproving] = useState(false);

    const handleApprove = async (request: AdminRoleRequestDto) => {
        if (!confirm(`Are you sure you want to approve admin role for ${request.username}?`)) {
            return;
        }

        try {
            await processRequest({
                id: request.id,
                body: { approve: true, rejectionReason: null },
            }).unwrap();
            toast.success(`Admin role approved for ${request.username}`);
            refetch();
        } catch (error) {
            showErrorToast(error);
        }
    };

    const handleReject = async () => {
        if (!showProcessModal) return;

        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        try {
            await processRequest({
                id: showProcessModal.id,
                body: { approve: false, rejectionReason },
            }).unwrap();
            toast.success(`Admin role request rejected for ${showProcessModal.username}`);
            setShowProcessModal(null);
            setRejectionReason("");
            refetch();
        } catch (error) {
            showErrorToast(error);
        }
    };

    const handleDelete = async (request: AdminRoleRequestDto) => {
        if (!confirm(`Are you sure you want to delete this admin role request?`)) {
            return;
        }

        try {
            await deleteRequest(request.id).unwrap();
            toast.success("Admin role request deleted");
            refetch();
        } catch (error) {
            showErrorToast(error);
        }
    };

    const getStatusBadge = (status: AdminRoleRequestStatus) => {
        switch (status) {
            case AdminRoleRequestStatus.PENDING:
                return <Badge bg="warning">Pending</Badge>;
            case AdminRoleRequestStatus.APPROVED:
                return <Badge bg="success">Approved</Badge>;
            case AdminRoleRequestStatus.REJECTED:
                return <Badge bg="danger">Rejected</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Stack gap={3}>
            <h2>Admin Role Requests</h2>

            <Row className="mb-3 align-items-center">
                <Col>
                    <InputGroup>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </Form.Select>
                        <Button variant="outline-secondary" onClick={() => refetch()}>
                            Refresh
                        </Button>
                    </InputGroup>
                </Col>
            </Row>

            {isLoading && <Alert variant="info">Loading...</Alert>}

            {data && (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>User ID</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Processed By</th>
                                <th>Rejection Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.content.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No admin role requests found
                                    </td>
                                </tr>
                            ) : (
                                data.content.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.username}</td>
                                        <td>{request.userId}</td>
                                        <td>{getStatusBadge(request.status)}</td>
                                        <td>{new Date(request.createdAt).toLocaleString()}</td>
                                        <td>{request.processedByUsername || "-"}</td>
                                        <td>{request.rejectionReason || "-"}</td>
                                        <td>
                                            <Stack direction="horizontal" gap={2}>
                                                {request.status === AdminRoleRequestStatus.PENDING && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => handleApprove(request)}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => {
                                                                setShowProcessModal(request);
                                                                setIsApproving(false);
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(request)}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {data.totalPages > 1 && (
                        <Stack direction="horizontal" gap={2} className="align-items-center">
                            <Button
                                variant="outline-secondary"
                                disabled={page === 0}
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                            >
                                Prev
                            </Button>
                            <span>
                                Page {data.number + 1} / {data.totalPages}
                            </span>
                            <Button
                                variant="outline-secondary"
                                disabled={data.number + 1 >= data.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </Stack>
                    )}
                </>
            )}

            {/* Reject Modal */}
            <Modal
                show={!!showProcessModal && !isApproving}
                onHide={() => {
                    setShowProcessModal(null);
                    setRejectionReason("");
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reject Admin Role Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You are about to reject the admin role request from{" "}
                        <strong>{showProcessModal?.username}</strong>.
                    </p>
                    <Form.Group>
                        <Form.Label>Rejection Reason *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejection"
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowProcessModal(null);
                            setRejectionReason("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleReject}>
                        Reject Request
                    </Button>
                </Modal.Footer>
            </Modal>
        </Stack>
    );
}

