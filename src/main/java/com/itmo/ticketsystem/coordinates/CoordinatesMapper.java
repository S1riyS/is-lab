package com.itmo.ticketsystem.coordinates;

import com.itmo.ticketsystem.coordinates.dto.CoordinatesCreateDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class CoordinatesMapper {

    public CoordinatesDto toDto(Coordinates coordinates) {
        if (coordinates == null) {
            return null;
        }

        CoordinatesDto dto = new CoordinatesDto();
        dto.setId(coordinates.getId());
        dto.setX(coordinates.getX());
        dto.setY(coordinates.getY());
        return dto;
    }

    public Coordinates toEntity(CoordinatesCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        Coordinates coordinates = new Coordinates();
        coordinates.setX(createDto.getX());
        coordinates.setY(createDto.getY());
        return coordinates;
    }

    public void updateEntity(Coordinates existingEntity, CoordinatesUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getX() != null) {
            existingEntity.setX(updateDto.getX());
        }
        if (updateDto.getY() != null) {
            existingEntity.setY(updateDto.getY());
        }
    }
}