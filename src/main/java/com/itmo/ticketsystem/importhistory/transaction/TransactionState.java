package com.itmo.ticketsystem.importhistory.transaction;

public enum TransactionState {
    STARTED, // Transaction started, not all participants are prepared yet
    PREPARED, // All participants are ready to commit (Phase 1 completed successfully)
    COMMITTING, // Commit in progress (Phase 2)
    COMMITTED, // Transaction completed successfully
    ABORTING, // Rollback in progress
    ABORTED // Transaction rolled back
}
