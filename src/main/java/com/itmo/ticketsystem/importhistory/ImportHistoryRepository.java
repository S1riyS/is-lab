package com.itmo.ticketsystem.importhistory;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.importhistory.transaction.TransactionState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Long> {

    List<ImportHistory> findByUserIdAndEntityTypeOrderByCreatedAtDesc(Long userId, EntityType entityType);

    List<ImportHistory> findByEntityTypeOrderByCreatedAtDesc(EntityType entityType);

    Optional<ImportHistory> findByTransactionId(UUID transactionId);

    List<ImportHistory> findByTransactionStatusIn(List<TransactionState> statuses);

    List<ImportHistory> findByUserIdAndTransactionStatusIn(Long userId, List<TransactionState> statuses);
}
