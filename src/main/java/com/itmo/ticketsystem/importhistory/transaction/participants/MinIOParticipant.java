package com.itmo.ticketsystem.importhistory.transaction.participants;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.storage.MinIOService;
import com.itmo.ticketsystem.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class MinIOParticipant {

    private final MinIOService minIOService;

    public String prepare(UUID txId, MultipartFile file, String targetPath) throws Exception {
        String pendingPath = buildPendingPath(txId, targetPath);

        log.info("[2PC MinIO] PREPARE: uploading to pending path: {}", pendingPath);

        try (InputStream inputStream = file.getInputStream()) {
            minIOService.uploadFile(
                    pendingPath,
                    inputStream,
                    file.getContentType() != null ? file.getContentType() : "application/json",
                    file.getSize());
        }

        log.info("[2PC MinIO] PREPARE: SUCCESS - file uploaded to {}", pendingPath);
        return pendingPath;
    }

    public String commit(String pendingPath, String finalPath) throws Exception {
        log.info("[2PC MinIO] COMMIT: moving {} -> {}", pendingPath, finalPath);

        minIOService.copyFile(pendingPath, finalPath);
        minIOService.deleteFile(pendingPath);

        log.info("[2PC MinIO] COMMIT: SUCCESS - file moved to {}", finalPath);
        return finalPath;
    }

    public void abort(String pendingPath) {
        log.info("[2PC MinIO] ABORT: deleting pending file: {}", pendingPath);

        if (pendingPath != null && !pendingPath.isEmpty()) {
            minIOService.deleteFileSafe(pendingPath);
            log.info("[2PC MinIO] ABORT: SUCCESS - pending file deleted");
        }
    }

    public boolean pendingFileExists(String pendingPath) {
        return minIOService.fileExists(pendingPath);
    }

    private String buildPendingPathPrefix(UUID txId) {
        return "pending-" + txId.toString() + "-";
    }

    public String buildPendingPath(UUID txId, String targetPath) {
        return buildPendingPathPrefix(txId) + targetPath;
    }

    public String extractFinalPath(UUID txId, String pendingPath) {
        String prefix = buildPendingPathPrefix(txId);
        if (pendingPath.startsWith(prefix)) {
            return pendingPath.substring(prefix.length());
        }
        return pendingPath;
    }

    public String buildFinalPath(EntityType entityType, User user, String originalFileName) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String fileName = (originalFileName != null && !originalFileName.isEmpty())
                ? originalFileName
                : "import.json";
        return String.format("%s/%d/%s-%s",
                entityType.name().toLowerCase(),
                user.getId(),
                timestamp,
                fileName);
    }
}
