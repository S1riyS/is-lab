package com.itmo.ticketsystem.event;

import com.itmo.ticketsystem.event.dto.EventCreateDto;
import com.itmo.ticketsystem.event.dto.EventDto;
import com.itmo.ticketsystem.event.dto.EventUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.ws.ChangeEventPublisher;
import com.itmo.ticketsystem.common.ws.ChangeEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import com.itmo.ticketsystem.common.exceptions.ForbiddenException;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventMapper eventMapper;

    @Autowired
    private ChangeEventPublisher changeEventPublisher;

    public Page<EventDto> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable).map(eventMapper::toDto);
    }

    public EventDto getEventById(Long id) {
        return eventRepository.findById(id)
                .map(eventMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));
    }

    @Transactional
    public EventDto createEvent(EventCreateDto eventCreateDto) {
        Event event = eventMapper.toEntity(eventCreateDto);
        Event savedEvent = eventRepository.save(event);
        EventDto dto = eventMapper.toDto(savedEvent);
        changeEventPublisher.publish("events", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public EventDto updateEvent(Long id, EventUpdateDto eventUpdateDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        if (!currentUser.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenException("Admin role required");
        }
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found with ID: " + id));

        eventMapper.updateEntity(existingEvent, eventUpdateDto);
        Event savedEvent = eventRepository.save(existingEvent);
        EventDto dto = eventMapper.toDto(savedEvent);
        changeEventPublisher.publish("events", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteEvent(Long id, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        if (!currentUser.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenException("Admin role required");
        }
        if (!eventRepository.existsById(id)) {
            throw new NotFoundException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
        changeEventPublisher.publish("events", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Event deleted successfully")
                .build();
    }

    public List<EventDto> searchEventsByName(String name) {
        return eventRepository.findByNameContainingIgnoreCase(name).stream()
                .map(eventMapper::toDto)
                .toList();
    }
}
