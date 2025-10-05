package com.itmo.ticketsystem.auth;

import com.itmo.ticketsystem.auth.dto.*;
import com.itmo.ticketsystem.user.dto.UserDto;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationDto> register(@Valid @RequestBody RegisterDto request) {
        System.out.println("Register request: " + request);
        AuthenticationDto authResponse = authService.registerUser(request.getUsername(), request.getPassword(),
                request.getRole());
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/current")
    public ResponseEntity<UserDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            UserDto userDto = authService.getCurrentUserInfo(username);
            return ResponseEntity.ok(userDto);
        }
        throw new UnauthorizedException("User not authenticated");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationDto> login(@Valid @RequestBody LoginDto request) {
        AuthenticationDto authResponse = authService.authenticateUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(authResponse);
    }
}
