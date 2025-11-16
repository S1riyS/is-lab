package com.itmo.ticketsystem.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.event.dto.EventCreateDto;
import com.itmo.ticketsystem.user.User;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventImportService extends Importer<EventCreateDto> {

    private final EventService eventService;

    public EventImportService(
            ObjectMapper objectMapper,
            Validator validator,
            EventService eventService) {
        super(EventCreateDto.class, objectMapper, validator);
        this.eventService = eventService;
    }

    @Override
    @Transactional
    protected int doImportInternal(EventCreateDto[] eventDtos, User currentUser) throws Exception {
        int count = 0;
        for (int i = 0; i < eventDtos.length; i++) {
            EventCreateDto dto = eventDtos[i];
            validateDto(dto, i);

            // Use service layer to enforce business logic and uniqueness constraints
            eventService.createEvent(dto, currentUser);
            count++;
        }

        return count;
    }
}
