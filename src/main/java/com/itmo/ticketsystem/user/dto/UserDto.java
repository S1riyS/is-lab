package com.itmo.ticketsystem.user.dto;

import com.itmo.ticketsystem.common.UserRole;
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
public class UserDto extends BaseEntityDto {
    private String username;
    private UserRole role;
    private LocalDateTime createdAt;
    private Boolean isActive = true;
}
