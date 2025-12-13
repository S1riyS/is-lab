package com.itmo.ticketsystem.importhistory;

import com.itmo.ticketsystem.importhistory.dto.ImportHistoryDto;
import org.springframework.stereotype.Component;

@Component
public class ImportHistoryMapper {

    public ImportHistoryDto toDto(ImportHistory importHistory) {
        if (importHistory == null) {
            return null;
        }

        return ImportHistoryDto.builder()
                .id(importHistory.getId())
                .entityType(importHistory.getEntityType())
                .status(importHistory.getStatus())
                .username(importHistory.getUser().getUsername())
                .userId(importHistory.getUser().getId())
                .createdCount(importHistory.getCreatedCount())
                .errorMessage(importHistory.getErrorMessage())
                .filePath(importHistory.getFilePath())
                .fileName(importHistory.getFileName())
                .createdAt(importHistory.getCreatedAt())
                .build();
    }
}
