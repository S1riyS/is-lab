package com.itmo.ticketsystem.common.security;

import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.common.exceptions.ForbiddenException;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import com.itmo.ticketsystem.user.User;
import org.springframework.stereotype.Service;

/**
 * Centralized service for authorization and permission checks.
 * Eliminates duplicate permission checking logic across services.
 */
@Service
public class AuthorizationService {

    /**
     * Ensures the user is authenticated.
     * 
     * @param user the current user
     * @throws UnauthorizedException if user is not authenticated
     */
    public void requireAuthenticated(User user) {
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }
    }

    /**
     * Ensures the user has admin role.
     * 
     * @param user the current user
     * @throws UnauthorizedException if user is not authenticated
     * @throws ForbiddenException    if user is not an admin
     */
    public void requireAdmin(User user) {
        requireAuthenticated(user);
        if (!isAdmin(user)) {
            throw new ForbiddenException("Admin access required");
        }
    }

    /**
     * Checks if the user is an admin.
     * 
     * @param user the user to check
     * @return true if user is admin, false otherwise
     */
    public boolean isAdmin(User user) {
        return user != null && UserRole.ADMIN.equals(user.getRole());
    }

    /**
     * Checks if the user can modify the resource.
     * User can modify if they are admin OR they are the creator of the resource.
     * 
     * @param user      the current user
     * @param creatorId the ID of the user who created the resource
     * @return true if user can modify, false otherwise
     */
    public boolean canModify(User user, Long creatorId) {
        if (user == null || creatorId == null) {
            return false;
        }
        return isAdmin(user) || user.getId().equals(creatorId);
    }

    /**
     * Ensures the user can modify the resource.
     * 
     * @param user      the current user
     * @param creatorId the ID of the user who created the resource
     * @throws UnauthorizedException if user is not authenticated
     * @throws ForbiddenException    if user cannot modify the resource
     */
    public void requireCanModify(User user, Long creatorId) {
        requireAuthenticated(user);
        if (!canModify(user, creatorId)) {
            throw new ForbiddenException("You don't have permission to modify this resource");
        }
    }

    /**
     * Ensures the user can modify the resource (with nullable creator).
     * If creator is null, only admins can modify.
     * 
     * @param user      the current user
     * @param creatorId the ID of the user who created the resource (may be null)
     * @throws UnauthorizedException if user is not authenticated
     * @throws ForbiddenException    if user cannot modify the resource
     */
    public void requireCanModifyOrAdmin(User user, Long creatorId) {
        requireAuthenticated(user);

        if (creatorId == null) {
            requireAdmin(user);
            return;
        }

        if (!canModify(user, creatorId)) {
            throw new ForbiddenException("Access denied");
        }
    }

    /**
     * Ensures the user is accessing their own resource or is an admin.
     * 
     * @param user         the current user
     * @param targetUserId the ID of the user being accessed
     * @throws UnauthorizedException if user is not authenticated
     * @throws ForbiddenException    if user is not authorized
     */
    public void requireSelfOrAdmin(User user, Long targetUserId) {
        requireAuthenticated(user);

        if (!isAdmin(user) && !user.getId().equals(targetUserId)) {
            throw new ForbiddenException("Access denied");
        }
    }
}
