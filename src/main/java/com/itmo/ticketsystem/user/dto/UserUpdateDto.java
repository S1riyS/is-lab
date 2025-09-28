package com.itmo.ticketsystem.user.dto;

import com.itmo.ticketsystem.common.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {

    private String username;
    private String password;
    private UserRole role;
    private Boolean isActive;
}
