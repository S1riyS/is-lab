package com.itmo.ticketsystem.auth.dto;

import com.itmo.ticketsystem.user.dto.UserDto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationDto {
    private String token;
    private UserDto user;
}
