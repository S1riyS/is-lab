package com.itmo.ticketsystem.adminrolerequest;

import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestDto;
import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestProcessDto;
import com.itmo.ticketsystem.common.controller.BaseController;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin-role-requests")
@RequiredArgsConstructor
public class AdminRoleRequestController extends BaseController {

    private final AdminRoleRequestService requestService;

    @PostMapping
    public ResponseEntity<AdminRoleRequestDto> createRequest() {
        AdminRoleRequestDto request = requestService.createRequest(getCurrentUser());
        return ResponseEntity.ok(request);
    }

    @GetMapping
    public ResponseEntity<Page<AdminRoleRequestDto>> getAllRequests(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String status) {
        Page<AdminRoleRequestDto> requests;
        if (status != null && !status.trim().isEmpty()) {
            try {
                AdminRoleRequestStatus statusEnum = AdminRoleRequestStatus.valueOf(status.toUpperCase());
                requests = requestService.getRequestsByStatus(statusEnum, pageable, getCurrentUser());
            } catch (IllegalArgumentException e) {
                requests = requestService.getAllRequests(pageable, getCurrentUser());
            }
        } else {
            requests = requestService.getAllRequests(pageable, getCurrentUser());
        }

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminRoleRequestDto> getRequestById(@PathVariable Long id) {
        AdminRoleRequestDto request = requestService.getRequestById(id, getCurrentUser());
        return ResponseEntity.ok(request);
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<AdminRoleRequestDto> processRequest(
            @PathVariable Long id,
            @Valid @RequestBody AdminRoleRequestProcessDto processDto) {
        AdminRoleRequestDto request = requestService.processRequest(id, processDto, getCurrentUser());
        return ResponseEntity.ok(request);
    }

    @GetMapping("/my-pending")
    public ResponseEntity<Optional<AdminRoleRequestDto>> getMyPendingRequest() {
        Optional<AdminRoleRequestDto> request = requestService.getPendingRequestForUser(getCurrentUser());
        return ResponseEntity.ok(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteRequest(@PathVariable Long id) {
        DeleteResponse response = requestService.deleteRequest(id, getCurrentUser());
        return ResponseEntity.ok(response);
    }
}
