package com.itmo.ticketsystem.common.storage;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.RemoveObjectArgs;
import io.minio.BucketExistsArgs;
import io.minio.CopyObjectArgs;
import io.minio.CopySource;
import io.minio.StatObjectArgs;
import io.minio.errors.MinioException;
import io.minio.errors.ErrorResponseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinIOService {

    private final MinioClient minioClient;
    private final MinIOConfig minIOConfig;

    public String uploadFile(String filePath, InputStream inputStream, String contentType, long size) throws Exception {
        try {
            ensureBucketExists();

            // Upload
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minIOConfig.getBucketName())
                            .object(filePath)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build());

            log.info("File uploaded to MinIO: {}/{}", minIOConfig.getBucketName(), filePath);
            return filePath;

        } catch (MinioException e) {
            log.error("Failed to upload file to MinIO: {}", e.getMessage(), e);
            throw new Exception("Failed to upload file to MinIO: " + e.getMessage(), e);
        }
    }

    public InputStream downloadFile(String filePath) throws Exception {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(minIOConfig.getBucketName())
                            .object(filePath)
                            .build());
        } catch (MinioException e) {
            log.error("Failed to download file from MinIO: {}", e.getMessage(), e);
            throw new Exception("Failed to download file from MinIO: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String filePath) throws Exception {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minIOConfig.getBucketName())
                            .object(filePath)
                            .build());
            log.info("File deleted from MinIO: {}/{}", minIOConfig.getBucketName(), filePath);
        } catch (MinioException e) {
            log.error("Failed to delete file from MinIO: {}", e.getMessage(), e);
            throw new Exception("Failed to delete file from MinIO: " + e.getMessage(), e);
        }
    }

    public void deleteFileSafe(String filePath) {
        try {
            deleteFile(filePath);
        } catch (Exception e) {
            log.warn("Could not delete file: {}", filePath);
        }
    }

    public void copyFile(String sourcePath, String destPath) throws Exception {
        try {
            minioClient.copyObject(
                    CopyObjectArgs.builder()
                            .bucket(minIOConfig.getBucketName())
                            .object(destPath)
                            .source(CopySource.builder()
                                    .bucket(minIOConfig.getBucketName())
                                    .object(sourcePath)
                                    .build())
                            .build());
            log.info("File copied in MinIO: {} -> {}", sourcePath, destPath);
        } catch (MinioException e) {
            log.error("Failed to copy file in MinIO: {}", e.getMessage(), e);
            throw new Exception("Failed to copy file in MinIO: " + e.getMessage(), e);
        }
    }

    public boolean fileExists(String filePath) {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(minIOConfig.getBucketName())
                            .object(filePath)
                            .build());
            return true;
        } catch (ErrorResponseException e) {
            return false;
        } catch (Exception e) {
            log.warn("Error checking file existence: {}", e.getMessage());
            return false;
        }
    }

    private void ensureBucketExists() throws Exception {
        try {
            boolean found = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(minIOConfig.getBucketName())
                            .build());

            if (!found) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(minIOConfig.getBucketName())
                                .build());
                log.info("Created bucket: {}", minIOConfig.getBucketName());
            }
        } catch (MinioException e) {
            log.error("Failed to ensure bucket exists: {}", e.getMessage(), e);
            throw new Exception("Failed to ensure bucket exists: " + e.getMessage(), e);
        }
    }
}
