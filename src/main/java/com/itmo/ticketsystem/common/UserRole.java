package com.itmo.ticketsystem.common;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

public enum UserRole {
    GUEST,
    USER,
    ADMIN;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (this) {
            case ADMIN -> List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER"),
                    new SimpleGrantedAuthority("ROLE_GUEST"));
            case USER -> List.of(
                    new SimpleGrantedAuthority("ROLE_USER"),
                    new SimpleGrantedAuthority("ROLE_GUEST"));
            case GUEST -> List.of(
                    new SimpleGrantedAuthority("ROLE_GUEST"));
        };
    }
}
