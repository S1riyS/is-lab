export enum AdminRoleRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export type AdminRoleRequestDto = {
    id: number;
    userId: number;
    username: string;
    status: AdminRoleRequestStatus;
    createdAt: string;
    updatedAt: string;
    processedByUserId?: number | null;
    processedByUsername?: string | null;
    rejectionReason?: string | null;
};

export type AdminRoleRequestCreateDto = {
    // Empty - user is taken from auth context
};

export type AdminRoleRequestProcessDto = {
    approve: boolean;
    rejectionReason?: string | null;
};

export type DeleteResponse = {
    message: string;
};

