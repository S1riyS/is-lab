package com.itmo.ticketsystem.importhistory.dto;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.ImportStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportHistoryDto {

    private Long id;
    private EntityType entityType;
    private ImportStatus status;
    private String username;
    private Long userId;
    private Integer createdCount;
    private String errorMessage;
    private LocalDateTime createdAt;
}
