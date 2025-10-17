import { useState } from "react";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { toast } from "react-toastify";

import { showErrorToast } from "@common/api/baseApi";

import { useCreateAdminRoleRequestMutation, useGetMyPendingRequestQuery } from "../api/adminRoleRequestsApi";
import { AdminRoleRequestStatus } from "../api/types";

export default function RequestAdminRoleButton() {
    const [showModal, setShowModal] = useState(false);
    const { data: pendingRequest, isLoading: isLoadingPending } = useGetMyPendingRequestQuery();
    const [createRequest, { isLoading: isCreating }] = useCreateAdminRoleRequestMutation();

    const handleCreateRequest = async () => {
        try {
            await createRequest().unwrap();
            toast.success("Admin role request submitted successfully!");
            setShowModal(false);
        } catch (error) {
            showErrorToast(error);
        }
    };

    // Don't show button if loading
    if (isLoadingPending) {
        return null;
    }

    // Show different UI based on pending request status
    if (pendingRequest) {
        if (pendingRequest.status === AdminRoleRequestStatus.PENDING) {
            return (
                <Button variant="warning" size="sm" disabled>
                    Admin Request Pending
                </Button>
            );
        } else if (pendingRequest.status === AdminRoleRequestStatus.REJECTED) {
            return (
                <Button variant="outline-warning" size="sm" onClick={() => setShowModal(true)}>
                    Request Admin Role Again
                </Button>
            );
        }
        // If approved, user should already be admin, so this shouldn't show
        return null;
    }

    return (
        <>
            <Button variant="outline-warning" size="sm" onClick={() => setShowModal(true)}>
                Request Admin Role
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <ModalHeader closeButton>
                    <ModalTitle>Request Admin Role</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p>
                        You are about to request admin privileges. An administrator will review your request and
                        either approve or reject it.
                    </p>
                    <p>Are you sure you want to proceed?</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateRequest} disabled={isCreating}>
                        {isCreating ? "Submitting..." : "Submit Request"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

