package com.itmo.ticketsystem.location;

import org.springframework.stereotype.Component;
import com.itmo.ticketsystem.common.exceptions.BusinessValidationException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LocationValidator {
    private final LocationRepository locationRepository;

    /**
     * Checks that a location name is unique.
     * Note: This check alone is not thread-safe. The caller must ensure proper
     * synchronization.
     */
    public void checkNameUniqueness(String name) {
        boolean exists = locationRepository.existsByName(name.trim());

        if (exists) {
            throw new BusinessValidationException("Location name '" + name + "' already exists");
        }
    }
}