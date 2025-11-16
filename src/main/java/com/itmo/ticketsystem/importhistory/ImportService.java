package com.itmo.ticketsystem.importhistory;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.ImportStatus;
import com.itmo.ticketsystem.common.security.AuthorizationService;
import com.itmo.ticketsystem.importhistory.dto.ImportHistoryDto;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.importhistory.dto.ImportResultDto;
import com.itmo.ticketsystem.user.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportService {

    private final ImportHistoryRepository importHistoryRepository;
    private final ImportHistoryMapper importHistoryMapper;
    private final AuthorizationService authorizationService;
    private final ObjectMapper objectMapper;
    private final ImportExecutor importExecutor;

    public List<ImportHistoryDto> getImportHistory(EntityType entityType, User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        List<ImportHistory> history;
        if (authorizationService.isAdmin(currentUser)) {
            history = importHistoryRepository.findByEntityTypeOrderByCreatedAtDesc(entityType);
        } else {
            history = importHistoryRepository.findByUserIdAndEntityTypeOrderByCreatedAtDesc(
                    currentUser.getId(), entityType);
        }

        return history.stream()
                .map(importHistoryMapper::toDto)
                .collect(Collectors.toList());
    }

    public ImportResultDto importEntities(MultipartFile file, User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        ImportHistory importHistory = new ImportHistory();
        importHistory.setUser(currentUser);

        try {
            // Parse the file to get entity type and data
            log.info("Starting import for user: {}", currentUser.getUsername());
            ImportRequestDto importRequest = objectMapper.readValue(file.getBytes(), ImportRequestDto.class);
            EntityType entityType = importRequest.getEntityType();
            importHistory.setEntityType(entityType);

            log.info("Import entity type: {}", entityType);

            // Execute import in a transaction
            int count = importExecutor.executeImport(importRequest, currentUser);
            log.info("Successfully imported {} entities of type {}", count, entityType);

            ImportHistory savedHistory = saveImportHistorySuccess(importHistory, count);

            return ImportResultDto.builder()
                    .importId(savedHistory.getId())
                    .status(ImportStatus.SUCCESS)
                    .createdCount(count)
                    .build();

        } catch (Exception e) {
            log.error("Import failed for user {}: {}", currentUser.getUsername(), e.getMessage(), e);

            ImportHistory savedHistory = saveImportHistoryFailure(importHistory, e.getMessage());

            return ImportResultDto.builder()
                    .importId(savedHistory.getId())
                    .status(ImportStatus.FAILED)
                    .createdCount(0)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    protected ImportHistory saveImportHistorySuccess(ImportHistory importHistory, int count) {
        importHistory.setStatus(ImportStatus.SUCCESS);
        importHistory.setCreatedCount(count);
        return importHistoryRepository.save(importHistory);
    }

    protected ImportHistory saveImportHistoryFailure(ImportHistory importHistory, String errorMessage) {
        importHistory.setStatus(ImportStatus.FAILED);
        importHistory.setCreatedCount(0);
        importHistory.setErrorMessage(errorMessage);
        return importHistoryRepository.save(importHistory);
    }
}