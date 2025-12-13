package com.itmo.ticketsystem.importhistory.transaction;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.ImportStatus;
import com.itmo.ticketsystem.importhistory.ImportHistory;
import com.itmo.ticketsystem.importhistory.ImportHistoryRepository;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.importhistory.dto.ImportResultDto;
import com.itmo.ticketsystem.importhistory.transaction.participants.DatabaseParticipant;
import com.itmo.ticketsystem.importhistory.transaction.participants.MinIOParticipant;
import com.itmo.ticketsystem.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportTransactionCoordinator {

    private final MinIOParticipant minIOParticipant;
    private final DatabaseParticipant databaseParticipant;
    private final ImportTransactionRepository txRepository;
    private final ImportHistoryRepository importHistoryRepository;

    public ImportResultDto executeWithTwoPhaseCommit(
            MultipartFile file,
            ImportRequestDto request,
            User user,
            String fileName) {

        UUID txId = UUID.randomUUID();
        log.info("[2PC] ========== Transaction {} STARTED ==========", txId);

        // New transaction record
        ImportTransaction tx = createTransaction(txId, user.getId(), request.getEntityType());
        String pendingPath = null;
        String finalPath = null;
        int count = 0;

        try {
            // ============ PHASE 1: PREPARE ============
            log.info("[2PC] Transaction {} - PHASE 1: PREPARE", txId);

            // 1.1 Final path
            finalPath = buildFilePath(request.getEntityType(), user, fileName);
            tx.setFinalFilePath(finalPath);

            // 1.2 MinIO Prepare: save tmp file
            pendingPath = minIOParticipant.prepare(txId, file, finalPath);
            tx.setPendingFilePath(pendingPath);
            updateTransactionStatus(tx, TransactionState.STARTED);

            // 1.3 Database Prepare: import without commit
            count = databaseParticipant.prepare(txId, request, user);
            tx.setCreatedCount(count);

            // 1.4 All participants ready -> PREPARED
            updateTransactionStatus(tx, TransactionState.PREPARED);
            log.info("[2PC] Transaction {} - PREPARED (count={})", txId, count);

            // ============ PHASE 2: COMMIT ============
            log.info("[2PC] Transaction {} - PHASE 2: COMMIT", txId);
            updateTransactionStatus(tx, TransactionState.COMMITTING);

            // 2.1 Database Commit
            databaseParticipant.commit(txId);

            // 2.2 MinIO Commit: move file to its destination
            minIOParticipant.commit(pendingPath, finalPath);

            // 2.3 SUCCESS
            updateTransactionStatus(tx, TransactionState.COMMITTED);
            log.info("[2PC] ========== Transaction {} COMMITTED ==========", txId);

            // Save import history record (in separate transaction)
            ImportHistory history = saveImportHistory(
                    user,
                    request.getEntityType(),
                    ImportStatus.SUCCESS,
                    count,
                    finalPath, fileName,
                    null);

            return ImportResultDto.builder()
                    .importId(history.getId())
                    .status(ImportStatus.SUCCESS)
                    .createdCount(count)
                    .build();

        } catch (Exception e) {
            // ============ ABORT ============
            log.error("[2PC] Transaction {} - ABORTING: {}", txId, e.getMessage(), e);
            abort(tx, txId, pendingPath);

            // Save failed import history record (in separate transaction)
            ImportHistory history = saveImportHistory(
                    user,
                    request.getEntityType(),
                    ImportStatus.FAILED,
                    0,
                    null,
                    fileName,
                    e.getMessage());

            return ImportResultDto.builder()
                    .importId(history.getId())
                    .status(ImportStatus.FAILED)
                    .createdCount(0)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected ImportTransaction createTransaction(UUID txId, Long userId, EntityType entityType) {
        ImportTransaction tx = ImportTransaction.builder()
                .transactionId(txId)
                .status(TransactionState.STARTED)
                .userId(userId)
                .entityType(entityType.name())
                .build();
        return txRepository.save(tx);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void updateTransactionStatus(ImportTransaction tx, TransactionState status) {
        tx.setStatus(status);
        tx.setUpdatedAt(LocalDateTime.now());
        txRepository.save(tx);
    }

    private void abort(ImportTransaction tx, UUID txId, String pendingPath) {
        try {
            updateTransactionStatus(tx, TransactionState.ABORTING);
        } catch (Exception e) {
            log.error("[2PC] Failed to update transaction status to ABORTING", e);
        }

        // Database rollback
        try {
            databaseParticipant.abort(txId);
        } catch (Exception e) {
            log.error("[2PC] Failed to abort database transaction: {}", e.getMessage());
        }

        // MinIO rollback
        try {
            if (pendingPath != null) {
                minIOParticipant.abort(pendingPath);
            }
        } catch (Exception e) {
            log.error("[2PC] Failed to abort MinIO: {}", e.getMessage());
        }

        // Update transaction record status
        try {
            tx.setStatus(TransactionState.ABORTED);
            tx.setUpdatedAt(LocalDateTime.now());
            txRepository.save(tx);
        } catch (Exception e) {
            log.error("[2PC] Failed to update transaction status to ABORTED", e);
        }

        log.info("[2PC] ========== Transaction {} ABORTED ==========", txId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected ImportHistory saveImportHistory(User user, EntityType entityType,
            ImportStatus status, int count,
            String filePath, String fileName,
            String errorMessage) {
        ImportHistory history = new ImportHistory();
        history.setUser(user);
        history.setEntityType(entityType);
        history.setStatus(status);
        history.setCreatedCount(count);
        history.setFilePath(filePath);
        history.setFileName(fileName);
        history.setErrorMessage(errorMessage);
        return importHistoryRepository.save(history);
    }

    private String buildFilePath(EntityType entityType, User user, String originalFileName) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String fileName = (originalFileName != null && !originalFileName.isEmpty())
                ? originalFileName
                : "import.json";
        return String.format("%s/%d/%s-%s",
                entityType.name().toLowerCase(),
                user.getId(),
                timestamp,
                fileName);
    }
}
