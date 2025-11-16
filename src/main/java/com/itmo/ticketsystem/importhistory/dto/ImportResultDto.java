package com.itmo.ticketsystem.importhistory.dto;

import com.itmo.ticketsystem.common.ImportStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportResultDto {
    private Long importId;
    private ImportStatus status;
    private Integer createdCount;
    private String errorMessage;
}
