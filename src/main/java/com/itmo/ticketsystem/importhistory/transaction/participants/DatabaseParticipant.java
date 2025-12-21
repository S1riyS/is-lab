package com.itmo.ticketsystem.importhistory.transaction.participants;

import com.itmo.ticketsystem.common.ImportStatus;
import com.itmo.ticketsystem.importhistory.ImportExecutor;
import com.itmo.ticketsystem.importhistory.ImportHistory;
import com.itmo.ticketsystem.importhistory.ImportHistoryRepository;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.importhistory.transaction.TransactionState;
import com.itmo.ticketsystem.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseParticipant {

    private final PlatformTransactionManager transactionManager;
    private final ImportHistoryRepository importHistoryRepository;
    private final ImportExecutor importExecutor;

    public record PrepareResult(Long txDbId) {
    }

    public record CommitResult(int count) {
    }

    public PrepareResult prepare(UUID txId, ImportRequestDto request, User user, String pendingPath, String finalPath) {
        log.info("[2PC DB] PREPARE: creating transaction record for txId={}", txId);

        TransactionTemplate tt = new TransactionTemplate(transactionManager);
        PrepareResult result = tt.execute(txStatus -> {
            // Create ImportHistory with transaction info
            ImportHistory history = ImportHistory.builder()
                    .transactionId(txId)
                    .transactionStatus(TransactionState.PREPARED)
                    .user(user)
                    .entityType(request.getEntityType())
                    .status(ImportStatus.PENDING)
                    .pendingFilePath(pendingPath)
                    .filePath(finalPath)
                    .build();
            history = importHistoryRepository.save(history);

            return new PrepareResult(history.getId());
        });

        log.info("[2PC DB] PREPARE: SUCCESS - transaction record created");
        return result;
    }

    public CommitResult commit(UUID txId, ImportRequestDto request, User user) {
        log.info("[2PC DB] COMMIT: importing data for txId={}", txId);

        TransactionTemplate tt = new TransactionTemplate(transactionManager);
        CommitResult result = tt.execute(txStatus -> {
            ImportHistory history = importHistoryRepository
                    .findByTransactionId(txId)
                    .orElseThrow(() -> new IllegalStateException("Transaction not found: " + txId));

            if (history.getTransactionStatus() != TransactionState.PREPARED) {
                throw new IllegalStateException(
                        "Transaction is not in PREPARED state: " + history.getTransactionStatus());
            }

            // Set COMMITTING status
            history.setTransactionStatus(TransactionState.COMMITTING);
            history.setUpdatedAt(LocalDateTime.now());
            importHistoryRepository.save(history);

            // Execute import
            int count = importExecutor.executeImport(request, user);

            // Set COMMITTED status
            history.setCreatedCount(count);
            history.setTransactionStatus(TransactionState.COMMITTED);
            history.setUpdatedAt(LocalDateTime.now());
            importHistoryRepository.save(history);

            return new CommitResult(count);
        });

        log.info("[2PC DB] COMMIT: SUCCESS - {} records imported", result != null ? result.count() : 0);
        return result;
    }

    public void abort(UUID txId) {
        abort(txId, null);
    }

    public void abort(UUID txId, String errorMessage) {
        log.info("[2PC DB] ABORT: marking transaction as aborted for txId={}", txId);

        TransactionTemplate tt = new TransactionTemplate(transactionManager);
        tt.executeWithoutResult(txStatus -> {
            importHistoryRepository.findByTransactionId(txId).ifPresent(history -> {
                // Set ABORTED status
                history.setTransactionStatus(TransactionState.ABORTED);
                history.setStatus(ImportStatus.FAILED);
                history.setErrorMessage(errorMessage);
                history.setUpdatedAt(LocalDateTime.now());
                importHistoryRepository.save(history);
            });
        });

        log.info("[2PC DB] ABORT: SUCCESS");
    }
}
