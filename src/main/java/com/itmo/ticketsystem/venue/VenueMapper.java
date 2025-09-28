package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.venue.dto.VenueCreateDto;
import com.itmo.ticketsystem.venue.dto.VenueDto;
import com.itmo.ticketsystem.venue.dto.VenueUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class VenueMapper {

    public VenueDto toDto(Venue venue) {
        if (venue == null) {
            return null;
        }

        VenueDto dto = new VenueDto();
        dto.setId(venue.getId());
        dto.setName(venue.getName());
        dto.setCapacity(venue.getCapacity());
        dto.setType(venue.getType());
        return dto;
    }

    public Venue toEntity(VenueCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        Venue venue = new Venue();
        venue.setName(createDto.getName());
        venue.setCapacity(createDto.getCapacity());
        venue.setType(createDto.getType());
        return venue;
    }

    public void updateEntity(Venue existingEntity, VenueUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getName() != null) {
            existingEntity.setName(updateDto.getName());
        }
        if (updateDto.getCapacity() != null) {
            existingEntity.setCapacity(updateDto.getCapacity());
        }
        if (updateDto.getType() != null) {
            existingEntity.setType(updateDto.getType());
        }
    }
}
