package com.itmo.ticketsystem.importhistory.transaction;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "import_transaction_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", unique = true, nullable = false)
    private UUID transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionState status;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "pending_file_path", length = 500)
    private String pendingFilePath;

    @Column(name = "final_file_path", length = 500)
    private String finalFilePath;

    @Column(name = "created_count")
    private Integer createdCount;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
