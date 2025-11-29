package com.itmo.ticketsystem.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * Base service class that provides application-level synchronization for
 * operations
 * that require uniqueness constraints without database-level constraints.
 * 
 * This approach uses synchronized blocks with key-specific locks to prevent
 * race
 * conditions during concurrent operations on the same logical entity (e.g.,
 * same name).
 * 
 * The synchronization wraps the entire transaction including the database
 * commit,
 * ensuring that the lock is only released AFTER the data is persisted to the
 * database.
 * 
 * Note: This synchronization only works for single-instance deployments.
 * For multi-instance deployments, use distributed locks or database
 * constraints.
 */
public abstract class ApplicationLayerSyncedService {

    @Autowired
    private TransactionTemplate transactionTemplate;

    // Map to store lock objects per normalized key for thread-safe operations
    private final ConcurrentHashMap<String, Object> keyLocks = new ConcurrentHashMap<>();

    /**
     * Executes an operation synchronized by the given key, wrapped in a
     * transaction.
     * This ensures that only one thread at a time can execute operations with the
     * same key,
     * and the lock is held until the transaction commits to the database.
     * 
     * @param key       The key to synchronize on (e.g., normalized name)
     * @param operation The operation to execute within the synchronized block and
     *                  transaction
     * @param <T>       The return type of the operation
     * @return The result of the operation
     */
    protected <T> T executeWithLock(String key, Supplier<T> operation) {
        Object lock = keyLocks.computeIfAbsent(key, k -> new Object());

        // Synchronize around the ENTIRE transaction including commit
        synchronized (lock) {
            return transactionTemplate.execute(status -> operation.get());
        }
        // Lock is released AFTER transaction commits to database
    }

    /**
     * Executes an operation synchronized by the given key, wrapped in a transaction
     * (void return).
     * This ensures that only one thread at a time can execute operations with the
     * same key,
     * and the lock is held until the transaction commits to the database.
     * 
     * @param key       The key to synchronize on (e.g., normalized name)
     * @param operation The operation to execute within the synchronized block and
     *                  transaction
     */
    protected void executeWithLock(String key, Runnable operation) {
        Object lock = keyLocks.computeIfAbsent(key, k -> new Object());

        // Synchronize around the ENTIRE transaction including commit
        synchronized (lock) {
            transactionTemplate.execute(status -> {
                operation.run();
                return null;
            });
        }
        // Lock is released AFTER transaction commits to database
    }
}
