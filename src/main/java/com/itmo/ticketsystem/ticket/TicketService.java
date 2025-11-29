package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.ticket.dto.TicketCreateDto;
import com.itmo.ticketsystem.ticket.dto.TicketDto;
import com.itmo.ticketsystem.ticket.dto.TicketUpdateDto;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.venue.Venue;
import com.itmo.ticketsystem.venue.VenueRepository;

import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.security.AuthorizationService;
import com.itmo.ticketsystem.common.ws.ChangeEventPublisher;
import com.itmo.ticketsystem.event.Event;
import com.itmo.ticketsystem.event.EventRepository;
import com.itmo.ticketsystem.common.ws.ChangeEvent;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final TicketMapper ticketMapper;
    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;
    private final TicketValidator ticketValidator;

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
        authorizationService.requireAuthenticated(currentUser);

        // Business-layer constraints
        // ticketValidator.validateDiscountForType(ticketCreateDto.getType(), ticketCreateDto.getDiscount());

        Ticket ticket = ticketMapper.toEntity(ticketCreateDto);
        ticket.setCreatedBy(currentUser);
        ticket.setUpdatedBy(currentUser);

        Ticket savedTicket = ticketRepository.save(ticket);
        TicketDto dto = ticketMapper.toDto(savedTicket);
        changeEventPublisher.publish("tickets", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public TicketDto updateTicket(Long id, TicketUpdateDto ticketUpdateDto, User currentUser) {
        Ticket existingTicket = ticketRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found with ID: " + id));

        authorizationService.requireCanModify(currentUser, existingTicket.getCreatedBy().getId());

        // Business-layer constraints
        // ticketValidator.validateDiscountForType(ticketUpdateDto.getType(), ticketUpdateDto.getDiscount());

        ticketMapper.updateEntity(existingTicket, ticketUpdateDto);
        existingTicket.setUpdatedBy(currentUser);

        Ticket savedTicket = ticketRepository.save(existingTicket);
        TicketDto dto = ticketMapper.toDto(savedTicket);
        changeEventPublisher.publish("tickets", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteTicket(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found with ID: " + id));

        authorizationService.requireCanModify(currentUser, ticket.getCreatedBy().getId());

        ticketRepository.deleteById(id);
        changeEventPublisher.publish("tickets", ChangeEvent.Operation.DELETE, id);
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

    public List<TicketDto> getTicketsByCommentGreaterThan(String comment) {
        int minLength = comment.length();
        List<Ticket> tickets = ticketRepository.findByCommentLengthGreaterThan(minLength);

        return tickets.stream()
                .map(ticketMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketDto createTicketWithDiscount(Ticket originalTicket, Double discountPercent, User currentUser) {
        // Build TicketCreateDto from original ticket
        TicketCreateDto ticketCreateDto = new TicketCreateDto();
        ticketCreateDto.setName(originalTicket.getName());
        ticketCreateDto.setCoordinatesId(
                originalTicket.getCoordinates() != null ? originalTicket.getCoordinates().getId() : null);
        ticketCreateDto.setCreationDate(originalTicket.getCreationDate());
        ticketCreateDto.setPersonId(originalTicket.getPerson() != null ? originalTicket.getPerson().getId() : null);
        ticketCreateDto.setEventId(originalTicket.getEvent() != null ? originalTicket.getEvent().getId() : null);
        ticketCreateDto.setType(originalTicket.getType());
        ticketCreateDto.setComment(originalTicket.getComment());
        ticketCreateDto.setVenueId(originalTicket.getVenue() != null ? originalTicket.getVenue().getId() : null);
        ticketCreateDto.setNumber(originalTicket.getNumber());

        // Apply discount and increase price
        Double discountAmount = originalTicket.getPrice() * (discountPercent / 100.0);
        Float newPrice = originalTicket.getPrice() + discountAmount.floatValue();
        ticketCreateDto.setPrice(newPrice);
        ticketCreateDto.setDiscount(discountPercent);

        return createTicket(ticketCreateDto, currentUser);
    }

    @Transactional
    public DeleteResponse cancelEvent(Long eventId) {
        // Verify venue exists
        Event event = eventRepository
                .findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + eventId));

        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        int count = tickets.size();

        ticketRepository.deleteAll(tickets);

        // Publish change events for each deleted ticket
        for (Ticket ticket : tickets) {
            changeEventPublisher.publish("tickets", ChangeEvent.Operation.DELETE, ticket.getId());
        }

        return DeleteResponse.builder()
                .message("Deleted " + count + " ticket(s) for event: " + event.getName())
                .build();

    }

    @Transactional
    public DeleteResponse deleteTicketsByVenueId(Long venueId) {
        // Verify venue exists
        Venue venue = venueRepository
                .findById(venueId)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + venueId));

        List<Ticket> tickets = ticketRepository.findByVenueId(venueId);
        int count = tickets.size();

        ticketRepository.deleteAll(tickets);

        // Publish change events for each deleted ticket
        for (Ticket ticket : tickets) {
            changeEventPublisher.publish("tickets", ChangeEvent.Operation.DELETE, ticket.getId());
        }

        return DeleteResponse.builder()
                .message("Deleted " + count + " ticket(s) for venue: " + venue.getName())
                .build();
    }
}
