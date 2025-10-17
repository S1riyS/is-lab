// src/modules/common/utils/permissions.ts
export interface EntityWithCreator {
    createdByUserId?: number | null;
}

export function canEditEntity(
    entity: EntityWithCreator,
    currentUserId: number | null,
    currentUserRole: string | null
): boolean {
    if (!currentUserId || !currentUserRole) {
        return false;
    }

    // Admins can edit anything
    if (currentUserRole === "ADMIN") {
        return true;
    }

    // Users can edit their own entities
    return entity.createdByUserId === currentUserId;
}

export function canDeleteEntity(
    entity: EntityWithCreator,
    currentUserId: number | null,
    currentUserRole: string | null
): boolean {
    return canEditEntity(entity, currentUserId, currentUserRole);
}

