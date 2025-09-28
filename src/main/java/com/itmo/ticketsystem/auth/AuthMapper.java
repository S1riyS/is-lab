package com.itmo.ticketsystem.auth;

import com.itmo.ticketsystem.auth.dto.AuthenticationDto;
import com.itmo.ticketsystem.user.dto.UserDto;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AuthMapper {

    /**
     * Converts a Map response from AuthService to AuthenticationDto
     * 
     * @param response Map containing id, username, role, token, and message
     * @return AuthenticationDto with token and user information
     */
    public AuthenticationDto mapToAuthenticationDto(Map<String, Object> response) {
        AuthenticationDto authResponse = new AuthenticationDto();
        authResponse.setToken((String) response.get("token"));
        authResponse.setUser(mapToUserDto(response));
        return authResponse;
    }

    /**
     * Converts a Map response from AuthService to UserDto
     * 
     * @param response Map containing id, username, and role
     * @return UserDto with user information
     */
    public UserDto mapToUserDto(Map<String, Object> response) {
        UserDto userDto = new UserDto();
        userDto.setId((Long) response.get("id"));
        userDto.setUsername((String) response.get("username"));
        userDto.setRole((com.itmo.ticketsystem.common.UserRole) response.get("role"));
        return userDto;
    }
}


