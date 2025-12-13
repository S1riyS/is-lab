package com.itmo.ticketsystem.importhistory.transaction.participants;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.coordinates.CoordinatesImportService;
import com.itmo.ticketsystem.event.EventImportService;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.location.LocationImportService;
import com.itmo.ticketsystem.person.PersonImportService;
import com.itmo.ticketsystem.ticket.TicketImportService;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.venue.VenueImportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Участник 2PC для базы данных.
 * Управляет транзакциями БД вручную для поддержки 2PC.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseParticipant {

    private final PlatformTransactionManager transactionManager;
    private final TicketImportService ticketImportService;
    private final EventImportService eventImportService;
    private final VenueImportService venueImportService;
    private final PersonImportService personImportService;
    private final LocationImportService locationImportService;
    private final CoordinatesImportService coordinatesImportService;

    private final ConcurrentHashMap<UUID, TransactionStatus> activeTransactions = new ConcurrentHashMap<>();

    public int prepare(UUID txId, ImportRequestDto request, User user) throws Exception {
        log.info("[2PC DB] PREPARE: starting transaction {}", txId);

        // New transaction
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setName("import-2pc-" + txId);
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        def.setIsolationLevel(TransactionDefinition.ISOLATION_READ_COMMITTED);

        TransactionStatus status = transactionManager.getTransaction(def);
        activeTransactions.put(txId, status);

        try {
            // Выполняем импорт
            Importer<?> importer = getImporter(request.getEntityType());
            int count = importer.doImport(request.getData(), user);

            log.info("[2PC DB] PREPARE: SUCCESS - {} records ready to commit", count);
            return count;

        } catch (Exception e) {
            log.error("[2PC DB] PREPARE: FAILED - {}", e.getMessage());
            // При ошибке откатываем транзакцию
            abort(txId);
            throw e;
        }
    }

    public void commit(UUID txId) {
        log.info("[2PC DB] COMMIT: committing transaction {}", txId);

        TransactionStatus status = activeTransactions.remove(txId);
        if (status != null) {
            try {
                transactionManager.commit(status);
                log.info("[2PC DB] COMMIT: SUCCESS");
            } catch (Exception e) {
                log.error("[2PC DB] COMMIT: FAILED - {}", e.getMessage());
                throw e;
            }
        } else {
            log.warn("[2PC DB] COMMIT: No active transaction found for {}", txId);
        }
    }

    public void abort(UUID txId) {
        log.info("[2PC DB] ABORT: rolling back transaction {}", txId);

        TransactionStatus status = activeTransactions.remove(txId);
        if (status != null) {
            try {
                transactionManager.rollback(status);
                log.info("[2PC DB] ABORT: SUCCESS");
            } catch (Exception e) {
                log.error("[2PC DB] ABORT: FAILED - {}", e.getMessage());
            }
        } else {
            log.warn("[2PC DB] ABORT: No active transaction found for {}", txId);
        }
    }

    private Importer<?> getImporter(EntityType entityType) {
        return switch (entityType) {
            case TICKET -> ticketImportService;
            case EVENT -> eventImportService;
            case VENUE -> venueImportService;
            case PERSON -> personImportService;
            case LOCATION -> locationImportService;
            case COORDINATES -> coordinatesImportService;
            default -> throw new IllegalArgumentException("Unsupported entity type: " + entityType);
        };
    }
}
