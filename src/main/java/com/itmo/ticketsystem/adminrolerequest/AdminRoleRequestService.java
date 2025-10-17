package com.itmo.ticketsystem.adminrolerequest;

import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestDto;
import com.itmo.ticketsystem.adminrolerequest.dto.AdminRoleRequestProcessDto;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.ForbiddenException;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AdminRoleRequestService {

    @Autowired
    private AdminRoleRequestRepository requestRepository;

    @Autowired
    private AdminRoleRequestMapper requestMapper;

    @Autowired
    private UserService userService;

    @Transactional
    public AdminRoleRequestDto createRequest(User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        // Check if user is already an admin
        if (UserRole.ADMIN.equals(currentUser.getRole())) {
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
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (!UserRole.ADMIN.equals(currentUser.getRole())) {
            throw new ForbiddenException("Only admins can view admin role requests");
        }

        return requestRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(requestMapper::toDto);
    }

    public Page<AdminRoleRequestDto> getRequestsByStatus(AdminRoleRequestStatus status, Pageable pageable,
            User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (!UserRole.ADMIN.equals(currentUser.getRole())) {
            throw new ForbiddenException("Only admins can view admin role requests");
        }

        return requestRepository.findByStatus(status, pageable)
                .map(requestMapper::toDto);
    }

    public AdminRoleRequestDto getRequestById(Long id, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (!UserRole.ADMIN.equals(currentUser.getRole())) {
            throw new ForbiddenException("Only admins can view admin role requests");
        }

        return requestRepository.findById(id)
                .map(requestMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Admin role request not found with ID: " + id));
    }

    @Transactional
    public AdminRoleRequestDto processRequest(Long requestId, AdminRoleRequestProcessDto processDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (!UserRole.ADMIN.equals(currentUser.getRole())) {
            throw new ForbiddenException("Only admins can process admin role requests");
        }

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
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        if (!UserRole.ADMIN.equals(currentUser.getRole())) {
            throw new ForbiddenException("Only admins can delete admin role requests");
        }

        if (!requestRepository.existsById(requestId)) {
            throw new NotFoundException("Admin role request not found with ID: " + requestId);
        }

        requestRepository.deleteById(requestId);
        return DeleteResponse.builder()
                .message("Admin role request deleted successfully")
                .build();
    }
}
