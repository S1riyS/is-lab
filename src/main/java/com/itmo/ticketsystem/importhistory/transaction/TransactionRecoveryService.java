package com.itmo.ticketsystem.importhistory.transaction;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itmo.ticketsystem.importhistory.transaction.participants.MinIOParticipant;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionRecoveryService {

    private final ImportTransactionRepository txRepository;
    private final MinIOParticipant minIOParticipant;

    private final List<TransactionState> pendingStatuses = List.of(
            TransactionState.STARTED,
            TransactionState.PREPARED,
            TransactionState.COMMITTING,
            TransactionState.ABORTING);

    @PostConstruct
    public void recoverPendingTransactions() {
        log.info("[2PC Recovery] ========== Checking for pending transactions ==========");

        try {
            List<ImportTransaction> pending = txRepository.findByStatusIn(pendingStatuses);

            if (pending.isEmpty()) {
                log.info("[2PC Recovery] No pending transactions found");
                return;
            }

            log.info("[2PC Recovery] Found {} pending transactions", pending.size());
            for (ImportTransaction tx : pending) {
                recoverTransaction(tx);
            }
            log.info("[2PC Recovery] ========== Recovery completed ==========");

        } catch (Exception e) {
            log.error("[2PC Recovery] Failed to recover transactions", e);
        }
    }

    private void recoverTransaction(ImportTransaction tx) {
        switch (tx.getStatus()) {
            case STARTED, PREPARED -> {
                log.info("[2PC Recovery] Transaction {} was in {} state, aborting", tx.getTransactionId(),
                        tx.getStatus());
                abortTransaction(tx);
            }
            case COMMITTING -> {
                log.info("[2PC Recovery] Transaction {} was COMMITTING, completing MinIO commit",
                        tx.getTransactionId());
                completeMinIOCommit(tx);
            }
            case ABORTING -> {
                log.info("[2PC Recovery] Transaction {} was ABORTING, completing abort", tx.getTransactionId());
                abortTransaction(tx);
            }
            default -> log.warn("[2PC Recovery] Unexpected status: {}", tx.getStatus());
        }
    }

    @Transactional
    protected void abortTransaction(ImportTransaction tx) {
        try {
            // Delete file if exists
            if (tx.getPendingFilePath() != null && !tx.getPendingFilePath().isEmpty()) {
                if (minIOParticipant.pendingFileExists(tx.getPendingFilePath())) {
                    minIOParticipant.abort(tx.getPendingFilePath());
                    log.info("[2PC Recovery] Deleted pending file: {}", tx.getPendingFilePath());
                } else {
                    log.info("[2PC Recovery] Pending file not found (already deleted): {}", tx.getPendingFilePath());
                }
            }

            tx.setStatus(TransactionState.ABORTED);
            tx.setUpdatedAt(LocalDateTime.now());
            txRepository.save(tx);

            log.info("[2PC Recovery] Transaction {} aborted successfully", tx.getTransactionId());

        } catch (Exception e) {
            log.error("[2PC Recovery] Failed to abort transaction {}: {}", tx.getTransactionId(), e.getMessage());
            tx.setErrorMessage("Recovery abort failed: " + e.getMessage());
            txRepository.save(tx);
        }
    }

    @Transactional
    protected void completeMinIOCommit(ImportTransaction tx) {
        try {
            String pendingPath = tx.getPendingFilePath();
            String finalPath = tx.getFinalFilePath();

            if (pendingPath == null || finalPath == null) {
                log.warn("[2PC Recovery] Missing file paths for transaction {}", tx.getTransactionId());
                tx.setStatus(TransactionState.ABORTED);
                tx.setErrorMessage("Missing file paths");
                txRepository.save(tx);
                return;
            }

            if (minIOParticipant.pendingFileExists(pendingPath)) {
                minIOParticipant.commit(pendingPath, finalPath);
                log.info("[2PC Recovery] Completed MinIO commit: {} -> {}", pendingPath, finalPath);
            } else {
                log.info("[2PC Recovery] Pending file not found, assuming already committed");
            }

            tx.setStatus(TransactionState.COMMITTED);
            tx.setUpdatedAt(LocalDateTime.now());
            txRepository.save(tx);

            log.info("[2PC Recovery] Transaction {} committed successfully", tx.getTransactionId());

        } catch (Exception e) {
            log.error("[2PC Recovery] Failed to complete MinIO commit for transaction {}: {}",
                    tx.getTransactionId(),
                    e.getMessage());

            tx.setErrorMessage("Recovery commit failed: " + e.getMessage());
            txRepository.save(tx);
        }
    }
}
