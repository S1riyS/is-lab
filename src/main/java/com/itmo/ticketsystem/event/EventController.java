package com.itmo.ticketsystem.event;

import com.itmo.ticketsystem.event.dto.EventCreateDto;
import com.itmo.ticketsystem.event.dto.EventDto;
import com.itmo.ticketsystem.event.dto.EventUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<EventDto> events;
        if (search != null && !search.trim().isEmpty()) {
            List<EventDto> eventList = eventService.searchEventsByName(search);
            events = PaginationUtil.createPageFromList(eventList, pageable);
        } else {
            events = eventService.getAllEvents(pageable);
        }
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        EventDto event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(@RequestBody @Valid EventCreateDto eventCreateDto) {
        EventDto createdEvent = eventService.createEvent(eventCreateDto);
        return ResponseEntity.ok(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id,
            @Valid @RequestBody EventUpdateDto eventUpdateDto) {
        EventDto updatedEvent = eventService.updateEvent(id, eventUpdateDto);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteEvent(@PathVariable Long id) {
        DeleteResponse response = eventService.deleteEvent(id);
        return ResponseEntity.ok(response);
    }
}
