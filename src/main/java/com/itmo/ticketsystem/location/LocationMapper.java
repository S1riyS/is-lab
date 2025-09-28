package com.itmo.ticketsystem.location;

import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.location.dto.LocationUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    public LocationDto toDto(Location location) {
        if (location == null) {
            return null;
        }

        LocationDto dto = new LocationDto();
        dto.setId(location.getId());
        dto.setX(location.getX());
        dto.setY(location.getY());
        dto.setZ(location.getZ());
        dto.setName(location.getName());
        return dto;
    }

    public Location toEntity(LocationCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        Location location = new Location();
        location.setX(createDto.getX());
        location.setY(createDto.getY());
        location.setZ(createDto.getZ());
        location.setName(createDto.getName());
        return location;
    }

    public void updateEntity(Location existingEntity, LocationUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getX() != null) {
            existingEntity.setX(updateDto.getX());
        }
        if (updateDto.getY() != null) {
            existingEntity.setY(updateDto.getY());
        }
        if (updateDto.getZ() != null) {
            existingEntity.setZ(updateDto.getZ());
        }
        if (updateDto.getName() != null) {
            existingEntity.setName(updateDto.getName());
        }
    }
}
