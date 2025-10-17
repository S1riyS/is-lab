package com.itmo.ticketsystem.coordinates;

import com.itmo.ticketsystem.coordinates.dto.CoordinatesCreateDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesUpdateDto;
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

@Service
public class CoordinatesService {

    @Autowired
    private CoordinatesRepository coordinatesRepository;

    @Autowired
    private CoordinatesMapper coordinatesMapper;

    @Autowired
    private ChangeEventPublisher changeEventPublisher;

    public Page<CoordinatesDto> getAllCoordinates(Pageable pageable) {
        return coordinatesRepository.findAll(pageable).map(coordinatesMapper::toDto);
    }

    public CoordinatesDto getCoordinatesById(Long id) {
        return coordinatesRepository.findById(id)
                .map(coordinatesMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));
    }

    @Transactional
    public CoordinatesDto createCoordinates(CoordinatesCreateDto coordinatesCreateDto, User currentUser) {
        Coordinates coordinates = coordinatesMapper.toEntity(coordinatesCreateDto);
        coordinates.setCreatedBy(currentUser);
        Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
        CoordinatesDto dto = coordinatesMapper.toDto(savedCoordinates);
        changeEventPublisher.publish("coordinates", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public CoordinatesDto updateCoordinates(Long id, CoordinatesUpdateDto coordinatesUpdateDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        Coordinates existingCoordinates = coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));

        if (!UserRole.ADMIN.equals(currentUser.getRole()) &&
                (existingCoordinates.getCreatedBy() == null
                        || !existingCoordinates.getCreatedBy().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("Access denied");
        }

        coordinatesMapper.updateEntity(existingCoordinates, coordinatesUpdateDto);
        Coordinates savedCoordinates = coordinatesRepository.save(existingCoordinates);
        CoordinatesDto dto = coordinatesMapper.toDto(savedCoordinates);
        changeEventPublisher.publish("coordinates", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteCoordinates(Long id, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        Coordinates coordinates = coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));

        if (!UserRole.ADMIN.equals(currentUser.getRole()) &&
                (coordinates.getCreatedBy() == null
                        || !coordinates.getCreatedBy().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("Access denied");
        }
        coordinatesRepository.deleteById(id);
        changeEventPublisher.publish("coordinates", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Coordinates deleted successfully")
                .build();
    }
}
