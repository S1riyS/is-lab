package com.itmo.ticketsystem.importhistory.transaction;

import com.itmo.ticketsystem.common.ImportStatus;
import com.itmo.ticketsystem.importhistory.ImportHistory;
import com.itmo.ticketsystem.importhistory.ImportHistoryRepository;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.importhistory.dto.ImportResultDto;
import com.itmo.ticketsystem.importhistory.transaction.participants.DatabaseParticipant;
import com.itmo.ticketsystem.importhistory.transaction.participants.DatabaseParticipant.CommitResult;
import com.itmo.ticketsystem.importhistory.transaction.participants.MinIOParticipant;
import com.itmo.ticketsystem.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportTransactionCoordinator {

    // Participants
    private final MinIOParticipant minIOParticipant;
    private final DatabaseParticipant databaseParticipant;

    private final ImportHistoryRepository importHistoryRepository;

    public ImportResultDto run(
            MultipartFile file,
            ImportRequestDto request,
            User user,
            String fileName) {

        UUID txId = UUID.randomUUID();
        log.info("[2PC] ========== Transaction {} STARTED ==========", txId);

        String stagingPath = null;
        String finalPath = null;

        try {
            // ============ PHASE 1: PREPARE ============
            log.info("[2PC] Transaction {} - PHASE 1: PREPARE", txId);

            // 1.1 MinIO Prepare: load to staging
            finalPath = minIOParticipant.buildFinalPath(request.getEntityType(), user, fileName);
            stagingPath = minIOParticipant.prepare(txId, file, finalPath);

            // 1.2 Database Prepare
            databaseParticipant.prepare(txId, request, user, stagingPath);

            log.info("[2PC] Transaction {} - PREPARED (all participants ready)", txId);

            // ============ PHASE 2: COMMIT ============
            log.info("[2PC] Transaction {} - PHASE 2: COMMIT", txId);

            // 2.1 Database Commit
            CommitResult commitResult = databaseParticipant.commit(txId, request, user, finalPath);

            // 2.2 MinIO Commit: move file from staging to finalPath
            minIOParticipant.commit(stagingPath, finalPath);

            log.info("[2PC] ========== Transaction {} COMMITTED (count={}) ==========", txId, commitResult.count());

            ImportHistory history = importHistoryRepository
                    .findByTransactionId(txId)
                    .orElseThrow(() -> new IllegalStateException("ImportHistory not found for txId: " + txId));

            return ImportResultDto.builder()
                    .importId(history.getId())
                    .status(ImportStatus.SUCCESS)
                    .createdCount(commitResult.count())
                    .build();

        } catch (Exception e) {
            // ============ ABORT ============
            log.error("[2PC] Transaction {} - ABORTING: {}", txId, e.getMessage(), e);
            abort(txId, stagingPath, e.getMessage());

            // Get the ImportHistory if it was created
            ImportHistory history = importHistoryRepository.findByTransactionId(txId).orElse(null);
            Long importId = history != null ? history.getId() : null;

            return ImportResultDto.builder()
                    .importId(importId)
                    .status(ImportStatus.FAILED)
                    .createdCount(0)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    private void abort(UUID txId, String stagingPath, String errorMessage) {
        log.info("[2PC] ABORT: rolling back transaction {}", txId);

        // Database abort (marks ImportHistory as ABORTED/FAILED)
        try {
            databaseParticipant.abort(txId, errorMessage);
        } catch (Exception e) {
            log.error("[2PC] Failed to abort database: {}", e.getMessage());
        }

        // MinIO abort (delete staging file)
        try {
            minIOParticipant.abort(stagingPath);
        } catch (Exception e) {
            log.error("[2PC] Failed to abort MinIO: {}", e.getMessage());
        }

        log.info("[2PC] ========== Transaction {} ABORTED ==========", txId);
    }
}
