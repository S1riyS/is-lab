package com.itmo.ticketsystem.auth;

import com.itmo.ticketsystem.auth.dto.AuthenticationDto;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.user.UserMapper;
import com.itmo.ticketsystem.user.UserService;
import com.itmo.ticketsystem.user.dto.UserDto;
import com.itmo.ticketsystem.common.exceptions.BadRequestException;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationDto authenticateUser(String username, String password) {
        User user = userService
                .findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(user);

        // Create UserDto
        UserDto userDto = userMapper.toDto(user);

        // Create AuthenticationDto
        AuthenticationDto authResponse = new AuthenticationDto();
        authResponse.setToken(token);
        authResponse.setUser(userDto);

        return authResponse;
    }

    public AuthenticationDto registerUser(String username, String password, UserRole role) {
        User isUserExists = userService
                .findByUsername(username)
                .orElse(null);

        if (isUserExists != null) {
            throw new BadRequestException("Registration failed", "Username is already taken");
        }

        User user = userService.createUserEntity(username, password, role);
        String token = jwtService.generateToken(user);

        // Create UserDto
        UserDto userDto = userMapper.toDto(user);

        // Create AuthenticationDto
        AuthenticationDto authResponse = new AuthenticationDto();
        authResponse.setToken(token);
        authResponse.setUser(userDto);

        return authResponse;
    }

    public UserDto getCurrentUserInfo(String username) {
        User user = userService
                .findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        UserDto userDto = userMapper.toDto(user);

        return userDto;
    }
}
