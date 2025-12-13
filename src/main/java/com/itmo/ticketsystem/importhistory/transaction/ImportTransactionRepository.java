package com.itmo.ticketsystem.importhistory.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImportTransactionRepository extends JpaRepository<ImportTransaction, Long> {

    Optional<ImportTransaction> findByTransactionId(UUID transactionId);

    List<ImportTransaction> findByStatusIn(List<TransactionState> statuses);

    List<ImportTransaction> findByUserIdAndStatusIn(Long userId, List<TransactionState> statuses);
}
