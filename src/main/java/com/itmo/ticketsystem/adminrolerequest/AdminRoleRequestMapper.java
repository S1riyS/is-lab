package com.itmo.ticketsystem.adminrolerequest;

import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestDto;
import org.springframework.stereotype.Component;

@Component
public class AdminRoleRequestMapper {

    public AdminRoleRequestDto toDto(AdminRoleRequest request) {
        if (request == null) {
            return null;
        }

        AdminRoleRequestDto dto = new AdminRoleRequestDto();
        dto.setId(request.getId());
        dto.setUserId(request.getUser().getId());
        dto.setUsername(request.getUser().getUsername());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        dto.setRejectionReason(request.getRejectionReason());

        if (request.getProcessedBy() != null) {
            dto.setProcessedByUserId(request.getProcessedBy().getId());
            dto.setProcessedByUsername(request.getProcessedBy().getUsername());
        }

        return dto;
    }
}
