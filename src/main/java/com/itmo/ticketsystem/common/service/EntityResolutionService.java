package com.itmo.ticketsystem.common.service;

import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.coordinates.Coordinates;
import com.itmo.ticketsystem.coordinates.CoordinatesRepository;
import com.itmo.ticketsystem.event.Event;
import com.itmo.ticketsystem.event.EventRepository;
import com.itmo.ticketsystem.location.Location;
import com.itmo.ticketsystem.location.LocationRepository;
import com.itmo.ticketsystem.person.Person;
import com.itmo.ticketsystem.person.PersonRepository;
import com.itmo.ticketsystem.venue.Venue;
import com.itmo.ticketsystem.venue.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Centralized service for resolving entity references by ID.
 * Eliminates repetitive entity lookup code across services.
 */
@Service
@RequiredArgsConstructor
public class EntityResolutionService {

    private final CoordinatesRepository coordinatesRepository;
    private final PersonRepository personRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final LocationRepository locationRepository;

    /**
     * Resolves coordinates by ID (required).
     * 
     * @param id the coordinates ID
     * @return the coordinates entity
     * @throws NotFoundException if coordinates not found
     */
    public Coordinates resolveCoordinates(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Coordinates ID cannot be null");
        }
        return coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));
    }

    /**
     * Resolves coordinates by ID (optional).
     * 
     * @param id the coordinates ID (may be null)
     * @return the coordinates entity, or null if id is null
     * @throws NotFoundException if id is not null but coordinates not found
     */
    public Coordinates resolveCoordinatesOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveCoordinates(id);
    }

    /**
     * Resolves person by ID (required).
     * 
     * @param id the person ID
     * @return the person entity
     * @throws NotFoundException if person not found
     */
    public Person resolvePerson(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Person ID cannot be null");
        }
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));
    }

    /**
     * Resolves person by ID (optional).
     * 
     * @param id the person ID (may be null)
     * @return the person entity, or null if id is null
     * @throws NotFoundException if id is not null but person not found
     */
    public Person resolvePersonOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolvePerson(id);
    }

    /**
     * Resolves event by ID (required).
     * 
     * @param id the event ID
     * @return the event entity
     * @throws NotFoundException if event not found
     */
    public Event resolveEvent(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Event ID cannot be null");
        }
        return eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));
    }

    /**
     * Resolves event by ID (optional).
     * 
     * @param id the event ID (may be null)
     * @return the event entity, or null if id is null
     * @throws NotFoundException if id is not null but event not found
     */
    public Event resolveEventOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveEvent(id);
    }

    /**
     * Resolves venue by ID (required).
     * 
     * @param id the venue ID
     * @return the venue entity
     * @throws NotFoundException if venue not found
     */
    public Venue resolveVenue(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Venue ID cannot be null");
        }
        return venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));
    }

    /**
     * Resolves venue by ID (optional).
     * 
     * @param id the venue ID (may be null)
     * @return the venue entity, or null if id is null
     * @throws NotFoundException if id is not null but venue not found
     */
    public Venue resolveVenueOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveVenue(id);
    }

    /**
     * Resolves location by ID (required).
     * 
     * @param id the location ID
     * @return the location entity
     * @throws NotFoundException if location not found
     */
    public Location resolveLocation(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Location ID cannot be null");
        }
        return locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));
    }

    /**
     * Resolves location by ID (optional).
     * 
     * @param id the location ID (may be null)
     * @return the location entity, or null if id is null
     * @throws NotFoundException if id is not null but location not found
     */
    public Location resolveLocationOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveLocation(id);
    }
}
