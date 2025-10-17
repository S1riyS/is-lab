package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.ticket.dto.TicketCreateDto;
import com.itmo.ticketsystem.ticket.dto.TicketDto;
import com.itmo.ticketsystem.ticket.dto.TicketUpdateDto;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.user.UserService;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

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
        User currentUser = getCurrentUser();
        TicketDto createdTicket = ticketService.createTicket(ticketCreateDto, currentUser);
        return ResponseEntity.ok(createdTicket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable Long id,
            @Valid @RequestBody TicketUpdateDto ticketUpdateDto) {
        User currentUser = getCurrentUser();
        TicketDto updatedTicket = ticketService.updateTicket(id, ticketUpdateDto, currentUser);
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteTicket(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        DeleteResponse response = ticketService.deleteTicket(id, currentUser);
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
        User currentUser = getCurrentUser();

        // Get the original ticket entity for the discount creation method
        Ticket originalTicketEntity = ticketService
                .getTicketEntityById(originalTicketId)
                .orElseThrow(() -> new NotFoundException("Original ticket not found with ID: " + originalTicketId));

        TicketDto newTicket = ticketService
                .createTicketWithDiscount(originalTicketEntity, discountPercent, currentUser);

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

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userService.findByUsername(username).orElse(null);
        }
        return null;
    }
}
