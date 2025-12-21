// src/modules/common/api/importTypes.ts

export enum ImportStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export enum EntityType {
    TICKET = "TICKET",
    EVENT = "EVENT",
    VENUE = "VENUE",
    PERSON = "PERSON",
    LOCATION = "LOCATION",
    COORDINATES = "COORDINATES",
}

export type ImportHistoryDto = {
    id: number;
    entityType: EntityType;
    status: ImportStatus;
    username: string;
    userId: number;
    createdCount?: number;
    errorMessage?: string;
    filePath?: string;
    fileName?: string;
    createdAt: string;
};

export type ImportResultDto = {
    importId: number;
    status: ImportStatus;
    createdCount?: number;
    errorMessage?: string;
};

