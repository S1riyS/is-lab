package com.itmo.ticketsystem.auth;

import com.itmo.ticketsystem.auth.dto.AuthenticationDto;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.user.UserMapper;
import com.itmo.ticketsystem.user.UserService;
import com.itmo.ticketsystem.user.dto.UserDto;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

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
