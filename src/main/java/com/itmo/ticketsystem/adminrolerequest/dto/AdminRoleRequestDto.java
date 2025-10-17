package com.itmo.ticketsystem.adminrolerequest.dto;

import com.itmo.ticketsystem.adminrolerequest.AdminRoleRequestStatus;
import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AdminRoleRequestDto extends BaseEntityDto {
    private Long userId;
    private String username;
    private AdminRoleRequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long processedByUserId;
    private String processedByUsername;
    private String rejectionReason;
}
