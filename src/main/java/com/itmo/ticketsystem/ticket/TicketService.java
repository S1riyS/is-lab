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
import com.itmo.ticketsystem.common.service.EntityResolutionService;
import com.itmo.ticketsystem.common.ws.ChangeEventPublisher;
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
    private final TicketMapper ticketMapper;
    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;
    private final EntityResolutionService entityResolutionService;

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

        Ticket ticket = ticketMapper.toEntity(ticketCreateDto);
        ticket.setCreatedBy(currentUser);
        ticket.setUpdatedBy(currentUser);

        // Resolve entity relationships using the centralized service
        ticket.setCoordinates(entityResolutionService.resolveCoordinates(ticketCreateDto.getCoordinatesId()));
        ticket.setPerson(entityResolutionService.resolvePerson(ticketCreateDto.getPersonId()));
        ticket.setEvent(entityResolutionService.resolveEventOptional(ticketCreateDto.getEventId()));
        ticket.setVenue(entityResolutionService.resolveVenueOptional(ticketCreateDto.getVenueId()));

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

        ticketMapper.updateEntity(existingTicket, ticketUpdateDto);

        // Update entity relationships using the centralized service
        if (ticketUpdateDto.getCoordinatesId() != null) {
            existingTicket
                    .setCoordinates(entityResolutionService.resolveCoordinates(ticketUpdateDto.getCoordinatesId()));
        }
        if (ticketUpdateDto.getPersonId() != null) {
            existingTicket.setPerson(entityResolutionService.resolvePerson(ticketUpdateDto.getPersonId()));
        }
        if (ticketUpdateDto.getEventId() != null) {
            existingTicket.setEvent(entityResolutionService.resolveEventOptional(ticketUpdateDto.getEventId()));
        }
        if (ticketUpdateDto.getVenueId() != null) {
            existingTicket.setVenue(entityResolutionService.resolveVenueOptional(ticketUpdateDto.getVenueId()));
        }

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

        // Check permissions using centralized authorization service
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

    @Transactional
    public DeleteResponse deleteTicketsByVenueId(Long venueId) {
        // Verify venue exists
        Venue venue = venueRepository
                .findById(venueId)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + venueId));

        List<Ticket> tickets = ticketRepository.findByVenueId(venueId);
        int count = tickets.size();

        // Delete all tickets
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
