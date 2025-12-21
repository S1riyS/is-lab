package com.itmo.ticketsystem.importhistory;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.security.AuthorizationService;
import com.itmo.ticketsystem.common.storage.MinIOService;
import com.itmo.ticketsystem.importhistory.dto.ImportHistoryDto;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.importhistory.dto.ImportResultDto;
import com.itmo.ticketsystem.importhistory.transaction.ImportTransactionCoordinator;
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
    private final MinIOService minIOService;
    private final ImportTransactionCoordinator ClassicTwoPhaseCommitOrchestrator;

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

        try {
            log.info("Starting import with 2PC for user: {}", currentUser.getUsername());

            ImportRequestDto importRequest = objectMapper.readValue(file.getBytes(), ImportRequestDto.class);
            log.info("Import entity type: {}", importRequest.getEntityType());

            // Execute import with 2PC orchestrator
            return ClassicTwoPhaseCommitOrchestrator.run(
                    file,
                    importRequest,
                    currentUser,
                    file.getOriginalFilename());

        } catch (Exception e) {
            log.error("Failed to import file for user {}: {}", currentUser.getUsername(), e.getMessage(), e);
            return ImportResultDto.builder()
                    .status(com.itmo.ticketsystem.common.ImportStatus.FAILED)
                    .createdCount(0)
                    .errorMessage("Failed to import file: " + e.getMessage())
                    .build();
        }
    }

    public ImportHistoryDto getImportHistoryById(Long id, User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        ImportHistory history = importHistoryRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Import history not found with ID: " + id));

        // Check access
        if (!authorizationService.isAdmin(currentUser) && !history.getUser().getId().equals(currentUser.getId())) {
            throw new NotFoundException("Import history not found with ID: " + id);
        }

        return importHistoryMapper.toDto(history);
    }

    public InputStream downloadImportFile(String filePath) throws Exception {
        return minIOService.downloadFile(filePath);
    }
}
