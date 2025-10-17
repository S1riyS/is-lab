package com.itmo.ticketsystem.adminrolerequest.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRoleRequestProcessDto {
    private Boolean approve;
    private String rejectionReason;
}
