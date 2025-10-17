package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.ticket.dto.TicketCreateDto;
import com.itmo.ticketsystem.ticket.dto.TicketDto;
import com.itmo.ticketsystem.ticket.dto.TicketUpdateDto;
import com.itmo.ticketsystem.common.controller.BaseController;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TicketController extends BaseController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<Page<TicketDto>> getAllTickets(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<TicketDto> tickets;

        if (search != null && !search.trim().isEmpty()) {
            tickets = ticketService.searchTicketsByName(search, pageable);
        } else {
            tickets = ticketService.getAllTickets(pageable);
        }
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long id) {
        TicketDto ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@Valid @RequestBody TicketCreateDto ticketCreateDto) {
        TicketDto createdTicket = ticketService.createTicket(ticketCreateDto, getCurrentUser());
        return ResponseEntity.ok(createdTicket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable Long id,
            @Valid @RequestBody TicketUpdateDto ticketUpdateDto) {
        TicketDto updatedTicket = ticketService.updateTicket(id, ticketUpdateDto, getCurrentUser());
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteTicket(@PathVariable Long id) {
        DeleteResponse response = ticketService.deleteTicket(id, getCurrentUser());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/special/group-by-name")
    public ResponseEntity<List<Object[]>> groupTicketsByName() {
        List<Object[]> groups = ticketService.groupTicketsByName();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/special/by-comment")
    public ResponseEntity<List<TicketDto>> getTicketsByCommentGreaterThan(@RequestParam String comment) {
        List<TicketDto> tickets = ticketService.getTicketsByCommentGreaterThan(comment);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/special/create-with-discount")
    public ResponseEntity<TicketDto> createTicketWithDiscount(
            @RequestParam Long originalTicketId,
            @RequestParam Double discountPercent) {
        // Get the original ticket entity for the discount creation method
        Ticket originalTicketEntity = ticketService
                .getTicketEntityById(originalTicketId)
                .orElseThrow(() -> new NotFoundException("Original ticket not found with ID: " + originalTicketId));

        TicketDto newTicket = ticketService
                .createTicketWithDiscount(originalTicketEntity, discountPercent, getCurrentUser());

        return ResponseEntity.ok(newTicket);
    }

    @PostMapping("/special/cancel-event")
    public ResponseEntity<DeleteResponse> cancelEvent(@RequestParam Long eventId) {
        ticketService.cancelEvent(eventId);
        DeleteResponse response = DeleteResponse.builder()
                .message("Event cancelled and all tickets deleted")
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/special/delete-by-venue")
    public ResponseEntity<DeleteResponse> deleteTicketsByVenue(@RequestParam Long venueId) {
        DeleteResponse response = ticketService.deleteTicketsByVenueId(venueId);
        return ResponseEntity.ok(response);
    }
}
