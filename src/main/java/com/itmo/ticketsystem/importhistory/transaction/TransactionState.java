package com.itmo.ticketsystem.importhistory.transaction;

public enum TransactionState {
    PREPARED,
    COMMITTING,
    COMMITTED,
    ABORTING,
    ABORTED
}
