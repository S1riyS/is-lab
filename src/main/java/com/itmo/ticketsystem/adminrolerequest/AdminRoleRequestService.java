package com.itmo.ticketsystem.adminrolerequest;

import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestDto;
import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestProcessDto;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.security.AuthorizationService;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminRoleRequestService {

    private final AdminRoleRequestRepository requestRepository;
    private final AdminRoleRequestMapper requestMapper;
    private final UserService userService;
    private final AuthorizationService authorizationService;

    @Transactional
    public AdminRoleRequestDto createRequest(User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        // Check if user is already an admin
        if (authorizationService.isAdmin(currentUser)) {
            throw new IllegalArgumentException("You are already an admin");
        }

        // Check if user already has a pending request
        Optional<AdminRoleRequest> existingRequest = requestRepository.findPendingRequestByUser(currentUser);
        if (existingRequest.isPresent()) {
            throw new IllegalArgumentException("You already have a pending admin role request");
        }

        AdminRoleRequest request = new AdminRoleRequest();
        request.setUser(currentUser);
        request.setStatus(AdminRoleRequestStatus.PENDING);

        AdminRoleRequest savedRequest = requestRepository.save(request);
        return requestMapper.toDto(savedRequest);
    }

    public Page<AdminRoleRequestDto> getAllRequests(Pageable pageable, User currentUser) {
        authorizationService.requireAdmin(currentUser);

        return requestRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(requestMapper::toDto);
    }

    public Page<AdminRoleRequestDto> getRequestsByStatus(AdminRoleRequestStatus status, Pageable pageable,
            User currentUser) {
        authorizationService.requireAdmin(currentUser);

        return requestRepository.findByStatus(status, pageable)
                .map(requestMapper::toDto);
    }

    public AdminRoleRequestDto getRequestById(Long id, User currentUser) {
        authorizationService.requireAdmin(currentUser);

        return requestRepository.findById(id)
                .map(requestMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Admin role request not found with ID: " + id));
    }

    @Transactional
    public AdminRoleRequestDto processRequest(Long requestId, AdminRoleRequestProcessDto processDto, User currentUser) {
        authorizationService.requireAdmin(currentUser);

        AdminRoleRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Admin role request not found with ID: " + requestId));

        if (!AdminRoleRequestStatus.PENDING.equals(request.getStatus())) {
            throw new IllegalArgumentException("This request has already been processed");
        }

        if (processDto.getApprove()) {
            // Approve the request
            request.setStatus(AdminRoleRequestStatus.APPROVED);
            request.setProcessedBy(currentUser);

            // Update user role to ADMIN
            userService.updateUserRole(request.getUser().getId(), UserRole.ADMIN);
        } else {
            // Reject the request
            request.setStatus(AdminRoleRequestStatus.REJECTED);
            request.setProcessedBy(currentUser);
            request.setRejectionReason(processDto.getRejectionReason());
        }

        AdminRoleRequest savedRequest = requestRepository.save(request);
        return requestMapper.toDto(savedRequest);
    }

    public Optional<AdminRoleRequestDto> getPendingRequestForUser(User currentUser) {
        if (currentUser == null) {
            return Optional.empty();
        }

        return requestRepository.findPendingRequestByUser(currentUser)
                .map(requestMapper::toDto);
    }

    @Transactional
    public DeleteResponse deleteRequest(Long requestId, User currentUser) {
        authorizationService.requireAdmin(currentUser);

        if (!requestRepository.existsById(requestId)) {
            throw new NotFoundException("Admin role request not found with ID: " + requestId);
        }

        requestRepository.deleteById(requestId);
        return DeleteResponse.builder()
                .message("Admin role request deleted successfully")
                .build();
    }
}
