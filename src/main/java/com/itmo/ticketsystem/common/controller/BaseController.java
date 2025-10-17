package com.itmo.ticketsystem.common.controller;

import com.itmo.ticketsystem.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Base controller providing common functionality for all controllers.
 * Contains utility methods for authentication and authorization.
 */
public abstract class BaseController {

    /**
     * Gets the currently authenticated user from the security context.
     * This method does NOT make a database call - it retrieves the User object
     * that was set during JWT authentication (contains id, username, role).
     * 
     * @return the authenticated User, or null if not authenticated
     */
    protected User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User) {
            return (User) principal;
        }

        return null;
    }

    /**
     * Gets the current user's ID.
     * 
     * @return the user ID, or null if not authenticated
     */
    protected Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    /**
     * Gets the current user's username.
     * 
     * @return the username, or null if not authenticated
     */
    protected String getCurrentUsername() {
        User user = getCurrentUser();
        return user != null ? user.getUsername() : null;
    }
}
