package com.itmo.ticketsystem.event;

import com.itmo.ticketsystem.event.dto.EventCreateDto;
import com.itmo.ticketsystem.event.dto.EventDto;
import com.itmo.ticketsystem.event.dto.EventUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventDto toDto(Event event) {
        if (event == null) {
            return null;
        }

        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDate(event.getDate());
        dto.setMinAge(event.getMinAge());
        dto.setDescription(event.getDescription());
        return dto;
    }

    public Event toEntity(EventCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        Event event = new Event();
        event.setName(createDto.getName());
        event.setDate(createDto.getDate());
        event.setMinAge(createDto.getMinAge());
        event.setDescription(createDto.getDescription());
        return event;
    }

    public void updateEntity(Event existingEntity, EventUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getName() != null) {
            existingEntity.setName(updateDto.getName());
        }
        if (updateDto.getDate() != null) {
            existingEntity.setDate(updateDto.getDate());
        }
        if (updateDto.getMinAge() != null) {
            existingEntity.setMinAge(updateDto.getMinAge());
        }
        if (updateDto.getDescription() != null) {
            existingEntity.setDescription(updateDto.getDescription());
        }
    }
}
