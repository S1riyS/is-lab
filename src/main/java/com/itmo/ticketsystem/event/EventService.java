package com.itmo.ticketsystem.event;

import com.itmo.ticketsystem.event.dto.EventCreateDto;
import com.itmo.ticketsystem.event.dto.EventDto;
import com.itmo.ticketsystem.event.dto.EventUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.security.AuthorizationService;
import com.itmo.ticketsystem.common.ws.ChangeEventPublisher;
import com.itmo.ticketsystem.common.ws.ChangeEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.itmo.ticketsystem.user.User;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;

    public Page<EventDto> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable).map(eventMapper::toDto);
    }

    public EventDto getEventById(Long id) {
        return eventRepository.findById(id)
                .map(eventMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));
    }

    @Transactional
    public EventDto createEvent(EventCreateDto eventCreateDto, User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        Event event = eventMapper.toEntity(eventCreateDto);
        event.setCreatedBy(currentUser);
        Event savedEvent = eventRepository.save(event);
        EventDto dto = eventMapper.toDto(savedEvent);
        changeEventPublisher.publish("events", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public EventDto updateEvent(Long id, EventUpdateDto eventUpdateDto, User currentUser) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));

        Long creatorId = existingEvent.getCreatedBy() != null ? existingEvent.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        eventMapper.updateEntity(existingEvent, eventUpdateDto);
        Event savedEvent = eventRepository.save(existingEvent);
        EventDto dto = eventMapper.toDto(savedEvent);
        changeEventPublisher.publish("events", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));

        Long creatorId = event.getCreatedBy() != null ? event.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        eventRepository.deleteById(id);
        changeEventPublisher.publish("events", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Event deleted successfully")
                .build();
    }

    public Page<EventDto> searchEventsByName(String name, Pageable pageable) {
        return eventRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(eventMapper::toDto);
    }
}
