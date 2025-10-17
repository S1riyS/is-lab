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

@Service
@RequiredArgsConstructor
public class EntityResolutionService {

    private final CoordinatesRepository coordinatesRepository;
    private final PersonRepository personRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final LocationRepository locationRepository;

    public Coordinates resolveCoordinates(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Coordinates ID cannot be null");
        }
        return coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));
    }

    public Coordinates resolveCoordinatesOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveCoordinates(id);
    }

    public Person resolvePerson(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Person ID cannot be null");
        }
        return personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));
    }

    public Person resolvePersonOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolvePerson(id);
    }

    public Event resolveEvent(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Event ID cannot be null");
        }
        return eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));
    }

    public Event resolveEventOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveEvent(id);
    }

    public Venue resolveVenue(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Venue ID cannot be null");
        }
        return venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));
    }

    public Venue resolveVenueOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveVenue(id);
    }

    public Location resolveLocation(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Location ID cannot be null");
        }
        return locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));
    }

    public Location resolveLocationOptional(Long id) {
        if (id == null) {
            return null;
        }
        return resolveLocation(id);
    }
}
