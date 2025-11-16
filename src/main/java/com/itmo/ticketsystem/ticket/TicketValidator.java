package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.common.TicketType;
import com.itmo.ticketsystem.common.exceptions.BusinessValidationException;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.venue.Venue;
import com.itmo.ticketsystem.venue.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketValidator {

    private final TicketRepository ticketRepository;
    private final VenueRepository venueRepository;

    public void validateEventCapacity(Long eventId, Long venueId) {
        if (eventId == null || venueId == null) {
            return;
        }

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + venueId));

        long currentTicketCount = ticketRepository.countByEventId(eventId);

        System.out.println("Current ticket count for event " + eventId + ": " + currentTicketCount);

        if (currentTicketCount >= venue.getCapacity()) {
            String message = String.format(
                    "Event has reached maximum capacity. Current tickets: %d, Venue capacity: %d",
                    currentTicketCount,
                    venue.getCapacity());
            throw new BusinessValidationException(message);
        }
    }

    public void validateEventCapacityForUpdate(Long eventId, Long venueId, Long excludeTicketId) {
        if (eventId == null || venueId == null || excludeTicketId == null) {
            return;
        }

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + venueId));

        // Count tickets for event, excluding the one being updated
        long currentTicketCount = ticketRepository.findByEventId(eventId).stream()
                .filter(ticket -> !ticket.getId().equals(excludeTicketId))
                .count();

        if (currentTicketCount >= venue.getCapacity()) {
            String message = String.format(
                    "Event has reached maximum capacity. Current tickets: %d, Venue capacity: %d",
                    currentTicketCount,
                    venue.getCapacity());
            throw new BusinessValidationException(message);
        }
    }

    public void validateDiscountForType(TicketType type, Double discount) {
        if (type == null || discount == null) {
            return;
        }

        switch (type) {
            case VIP:
                if (discount < 10.0 || discount > 30.0) {
                    throw new BusinessValidationException("VIP tickets must have discount between 10% and 30%");
                }
                break;
            case BUDGETARY:
                if (discount < 5.0 || discount > 15.0) {
                    throw new BusinessValidationException("Budgetary tickets must have discount between 5% and 15%");
                }
                break;
            case USUAL:
            case CHEAP:
                // No additional validation for USUAL and CHEAP tickets
                break;
        }
    }
}
