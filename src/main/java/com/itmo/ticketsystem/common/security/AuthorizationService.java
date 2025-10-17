package com.itmo.ticketsystem.common.security;

import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.common.exceptions.ForbiddenException;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import com.itmo.ticketsystem.user.User;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    public void requireAuthenticated(User user) {
        if (user == null) {
            throw new UnauthorizedException("User not authenticated");
        }
    }

    public void requireAdmin(User user) {
        requireAuthenticated(user);
        if (!isAdmin(user)) {
            throw new ForbiddenException("Admin access required");
        }
    }

    public boolean isAdmin(User user) {
        return user != null && UserRole.ADMIN.equals(user.getRole());
    }

    public boolean canModify(User user, Long creatorId) {
        if (user == null || creatorId == null) {
            return false;
        }
        return isAdmin(user) || user.getId().equals(creatorId);
    }

    public void requireCanModify(User user, Long creatorId) {
        requireAuthenticated(user);
        if (!canModify(user, creatorId)) {
            throw new ForbiddenException("You don't have permission to modify this resource");
        }
    }

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

    public void requireSelfOrAdmin(User user, Long targetUserId) {
        requireAuthenticated(user);

        if (!isAdmin(user) && !user.getId().equals(targetUserId)) {
            throw new ForbiddenException("Access denied");
        }
    }
}
