package com.itmo.ticketsystem.venue;

import org.springframework.stereotype.Component;

import com.itmo.ticketsystem.common.exceptions.BusinessValidationException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VenueValidator {
    private final VenueRepository venueRepository;

    public void checkNameUniqueness(String name) {
        boolean exists = venueRepository.existsByName(name.trim());
        
        if (exists) {
            throw new BusinessValidationException("Venue name '" + name + "' already exists");
        }
    }
}
