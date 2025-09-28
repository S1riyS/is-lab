package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.ticket.dto.TicketCreateDto;
import com.itmo.ticketsystem.ticket.dto.TicketDto;
import com.itmo.ticketsystem.ticket.dto.TicketUpdateDto;
import com.itmo.ticketsystem.event.Event;
import com.itmo.ticketsystem.event.EventRepository;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.venue.Venue;
import com.itmo.ticketsystem.venue.VenueRepository;
import com.itmo.ticketsystem.person.Person;
import com.itmo.ticketsystem.person.PersonRepository;
import com.itmo.ticketsystem.coordinates.Coordinates;
import com.itmo.ticketsystem.coordinates.CoordinatesRepository;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.exceptions.ForbiddenException;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private CoordinatesRepository coordinatesRepository;

    @Autowired
    private TicketMapper ticketMapper;

    public Page<TicketDto> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(ticketMapper::toDto);
    }

    public Page<TicketDto> searchTicketsByName(String name, Pageable pageable) {
        return ticketRepository.findByNameContainingIgnoreCase(name, pageable).map(ticketMapper::toDto);
    }

    public TicketDto getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(ticketMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Ticket not found with ID: " + id));
    }

    public Optional<Ticket> getTicketEntityById(Long id) {
        return ticketRepository.findById(id);
    }

    @Transactional
    public TicketDto createTicket(TicketCreateDto ticketCreateDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        Ticket ticket = ticketMapper.toEntity(ticketCreateDto);
        ticket.setCreatedBy(currentUser);
        ticket.setUpdatedBy(currentUser);

        // Set coordinates by ID
        if (ticketCreateDto.getCoordinatesId() != null) {
            Coordinates coordinates = coordinatesRepository.findById(ticketCreateDto.getCoordinatesId())
                    .orElseThrow(() -> new NotFoundException(
                            "Coordinates not found with ID: " + ticketCreateDto.getCoordinatesId()));
            ticket.setCoordinates(coordinates);
        }

        // Set person by ID
        if (ticketCreateDto.getPersonId() != null) {
            Person person = personRepository.findById(ticketCreateDto.getPersonId())
                    .orElseThrow(() -> new NotFoundException(
                            "Person not found with ID: " + ticketCreateDto.getPersonId()));
            ticket.setPerson(person);
        }

        // Set event by ID
        if (ticketCreateDto.getEventId() != null) {
            Event event = eventRepository.findById(ticketCreateDto.getEventId())
                    .orElseThrow(() -> new NotFoundException(
                            "Event not found with ID: " + ticketCreateDto.getEventId()));
            ticket.setEvent(event);
        }

        // Set venue by ID
        if (ticketCreateDto.getVenueId() != null) {
            Venue venue = venueRepository.findById(ticketCreateDto.getVenueId())
                    .orElseThrow(() -> new NotFoundException(
                            "Venue not found with ID: " + ticketCreateDto.getVenueId()));
            ticket.setVenue(venue);
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toDto(savedTicket);
    }

    @Transactional
    public TicketDto updateTicket(Long id, TicketUpdateDto ticketUpdateDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        Ticket existingTicket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found with ID: " + id));

        // Check permissions
        if (!currentUser.getRole().equals(UserRole.ADMIN) &&
                !existingTicket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You don't have permission to update this ticket");
        }

        // Update fields using mapper
        ticketMapper.updateEntity(existingTicket, ticketUpdateDto);

        // Update coordinates by ID
        if (ticketUpdateDto.getCoordinatesId() != null) {
            Coordinates coordinates = coordinatesRepository.findById(ticketUpdateDto.getCoordinatesId())
                    .orElseThrow(() -> new NotFoundException(
                            "Coordinates not found with ID: " + ticketUpdateDto.getCoordinatesId()));
            existingTicket.setCoordinates(coordinates);
        }

        // Update person by ID
        if (ticketUpdateDto.getPersonId() != null) {
            Person person = personRepository.findById(ticketUpdateDto.getPersonId())
                    .orElseThrow(() -> new NotFoundException(
                            "Person not found with ID: " + ticketUpdateDto.getPersonId()));
            existingTicket.setPerson(person);
        }

        // Update event by ID
        if (ticketUpdateDto.getEventId() != null) {
            Event event = eventRepository.findById(ticketUpdateDto.getEventId())
                    .orElseThrow(() -> new NotFoundException(
                            "Event not found with ID: " + ticketUpdateDto.getEventId()));
            existingTicket.setEvent(event);
        }

        // Update venue by ID
        if (ticketUpdateDto.getVenueId() != null) {
            Venue venue = venueRepository.findById(ticketUpdateDto.getVenueId())
                    .orElseThrow(() -> new NotFoundException(
                            "Venue not found with ID: " + ticketUpdateDto.getVenueId()));
            existingTicket.setVenue(venue);
        }

        existingTicket.setUpdatedBy(currentUser);

        Ticket savedTicket = ticketRepository.save(existingTicket);
        return ticketMapper.toDto(savedTicket);
    }

    @Transactional
    public DeleteResponse deleteTicket(Long id, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found with ID: " + id));

        // Check permissions
        if (!currentUser.getRole().equals(UserRole.ADMIN) &&
                !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You don't have permission to delete this ticket");
        }

        ticketRepository.deleteById(id);
        return DeleteResponse.builder()
                .message("Ticket deleted successfully")
                .build();
    }

    @Transactional
    public void deleteTicketsByVenue(Venue venue) {
        List<Ticket> tickets = ticketRepository.findByVenue(venue);
        ticketRepository.deleteAll(tickets);
    }

    public List<Object[]> groupTicketsByName() {
        return ticketRepository.groupByName();
    }

    public List<Ticket> getTicketsByCommentGreaterThan(String comment) {
        return ticketRepository.findByCommentGreaterThan(comment);
    }

    @Transactional
    public TicketDto createTicketWithDiscount(Ticket originalTicket, Double discountPercent, User currentUser) {
        Ticket newTicket = new Ticket();
        newTicket.setName(originalTicket.getName());
        newTicket.setCoordinates(originalTicket.getCoordinates());
        newTicket.setPerson(originalTicket.getPerson());
        newTicket.setEvent(originalTicket.getEvent());
        newTicket.setType(originalTicket.getType());
        newTicket.setComment(originalTicket.getComment());
        newTicket.setVenue(originalTicket.getVenue());
        newTicket.setCreatedBy(currentUser);
        newTicket.setUpdatedBy(currentUser);

        // Apply discount and increase price
        Double discountAmount = originalTicket.getPrice() * (discountPercent / 100.0);
        newTicket.setPrice(originalTicket.getPrice() + discountAmount.floatValue());
        newTicket.setDiscount(discountPercent);
        newTicket.setNumber(originalTicket.getNumber());

        Ticket savedTicket = ticketRepository.save(newTicket);
        return ticketMapper.toDto(savedTicket);
    }

    @Transactional
    public void cancelEvent(Long eventId) {
        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        ticketRepository.deleteAll(tickets);
    }
}
