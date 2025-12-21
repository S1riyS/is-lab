package com.itmo.ticketsystem.importhistory;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.ImportStatus;
import com.itmo.ticketsystem.importhistory.transaction.TransactionState;
import com.itmo.ticketsystem.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "import_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Transaction fields for 2PC
    @Column(name = "transaction_id", unique = true)
    private UUID transactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status")
    private TransactionState transactionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type")
    @NotNull(message = "Entity type cannot be null")
    private EntityType entityType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @NotNull(message = "Status cannot be null")
    private ImportStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NotNull(message = "User cannot be null")
    private User user;

    @Column(name = "created_count")
    private Integer createdCount;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "pending_file_path", length = 500)
    private String pendingFilePath; // Staging path in MinIO (for 2PC)

    @Column(name = "file_path")
    private String filePath; // Final path to file in MinIO

    @Column(name = "file_name")
    private String fileName; // Original filename

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
