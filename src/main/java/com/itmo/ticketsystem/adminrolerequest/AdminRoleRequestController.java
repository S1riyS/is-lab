package com.itmo.ticketsystem.adminrolerequest;

import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestDto;
import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestProcessDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin-role-requests")
@CrossOrigin(origins = "*")
public class AdminRoleRequestController {

    @Autowired
    private AdminRoleRequestService requestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<AdminRoleRequestDto> createRequest() {
        User currentUser = getCurrentUser();
        AdminRoleRequestDto request = requestService.createRequest(currentUser);
        return ResponseEntity.ok(request);
    }

    @GetMapping
    public ResponseEntity<Page<AdminRoleRequestDto>> getAllRequests(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String status) {
        User currentUser = getCurrentUser();

        Page<AdminRoleRequestDto> requests;
        if (status != null && !status.trim().isEmpty()) {
            try {
                AdminRoleRequestStatus statusEnum = AdminRoleRequestStatus.valueOf(status.toUpperCase());
                requests = requestService.getRequestsByStatus(statusEnum, pageable, currentUser);
            } catch (IllegalArgumentException e) {
                requests = requestService.getAllRequests(pageable, currentUser);
            }
        } else {
            requests = requestService.getAllRequests(pageable, currentUser);
        }

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminRoleRequestDto> getRequestById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        AdminRoleRequestDto request = requestService.getRequestById(id, currentUser);
        return ResponseEntity.ok(request);
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<AdminRoleRequestDto> processRequest(
            @PathVariable Long id,
            @Valid @RequestBody AdminRoleRequestProcessDto processDto) {
        User currentUser = getCurrentUser();
        AdminRoleRequestDto request = requestService.processRequest(id, processDto, currentUser);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/my-pending")
    public ResponseEntity<Optional<AdminRoleRequestDto>> getMyPendingRequest() {
        User currentUser = getCurrentUser();
        Optional<AdminRoleRequestDto> request = requestService.getPendingRequestForUser(currentUser);
        return ResponseEntity.ok(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteRequest(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        DeleteResponse response = requestService.deleteRequest(id, currentUser);
        return ResponseEntity.ok(response);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userService.findByUsername(username).orElse(null);
        }
        return null;
    }
}
