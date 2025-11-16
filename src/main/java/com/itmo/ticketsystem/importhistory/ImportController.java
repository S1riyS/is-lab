package com.itmo.ticketsystem.importhistory;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.controller.BaseController;
import com.itmo.ticketsystem.common.exceptions.BadRequestException;
import com.itmo.ticketsystem.importhistory.dto.ImportHistoryDto;
import com.itmo.ticketsystem.importhistory.dto.ImportResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportController extends BaseController {

    private final ImportService importService;

    @PostMapping
    public ResponseEntity<ImportResultDto> importEntities(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Import failed", "File not found");
        }
        ImportResultDto result = importService.importEntities(file, getCurrentUser());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history/{entityType}")
    public ResponseEntity<List<ImportHistoryDto>> getImportHistory(
            @PathVariable EntityType entityType) {
        List<ImportHistoryDto> history = importService.getImportHistory(entityType, getCurrentUser());
        return ResponseEntity.ok(history);
    }
}
