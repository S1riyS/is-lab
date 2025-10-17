package com.itmo.ticketsystem.coordinates;

import com.itmo.ticketsystem.coordinates.dto.CoordinatesCreateDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesUpdateDto;
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
public class CoordinatesService {

    private final CoordinatesRepository coordinatesRepository;
    private final CoordinatesMapper coordinatesMapper;
    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;

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
        authorizationService.requireAuthenticated(currentUser);

        Coordinates coordinates = coordinatesMapper.toEntity(coordinatesCreateDto);
        coordinates.setCreatedBy(currentUser);
        Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
        CoordinatesDto dto = coordinatesMapper.toDto(savedCoordinates);
        changeEventPublisher.publish("coordinates", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public CoordinatesDto updateCoordinates(Long id, CoordinatesUpdateDto coordinatesUpdateDto, User currentUser) {
        Coordinates existingCoordinates = coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));

        Long creatorId = existingCoordinates.getCreatedBy() != null ? existingCoordinates.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        coordinatesMapper.updateEntity(existingCoordinates, coordinatesUpdateDto);
        Coordinates savedCoordinates = coordinatesRepository.save(existingCoordinates);
        CoordinatesDto dto = coordinatesMapper.toDto(savedCoordinates);
        changeEventPublisher.publish("coordinates", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteCoordinates(Long id, User currentUser) {
        Coordinates coordinates = coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));

        Long creatorId = coordinates.getCreatedBy() != null ? coordinates.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        coordinatesRepository.deleteById(id);
        changeEventPublisher.publish("coordinates", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Coordinates deleted successfully")
                .build();
    }
}
