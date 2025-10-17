package com.itmo.ticketsystem.auth;

import com.itmo.ticketsystem.auth.dto.*;
import com.itmo.ticketsystem.common.controller.BaseController;
import com.itmo.ticketsystem.user.dto.UserDto;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController extends BaseController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationDto> register(@Valid @RequestBody RegisterDto request) {
        System.out.println("Register request: " + request);
        AuthenticationDto authResponse = authService.registerUser(request.getUsername(), request.getPassword(),
                request.getRole());
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/current")
    public ResponseEntity<UserDto> getCurrentUserInfo() {
        String username = getCurrentUsername();
        if (username == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        UserDto userDto = authService.getCurrentUserInfo(username);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationDto> login(@Valid @RequestBody LoginDto request) {
        AuthenticationDto authResponse = authService.authenticateUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(authResponse);
    }
}
