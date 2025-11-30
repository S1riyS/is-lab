package com.itmo.ticketsystem.location;

import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.location.dto.LocationUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.security.AuthorizationService;
import com.itmo.ticketsystem.common.service.ApplicationLayerSyncedService;
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
public class LocationServiceSyncronized extends ApplicationLayerSyncedService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;
    private final LocationValidator locationValidator;

    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;

    public Page<LocationDto> getAllLocations(Pageable pageable) {
        return locationRepository.findAll(pageable).map(locationMapper::toDto);
    }

    public LocationDto getLocationById(Long id) {
        return locationRepository.findById(id)
                .map(locationMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));
    }

    public LocationDto createLocation(LocationCreateDto locationCreateDto, User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        Location location = locationMapper.toEntity(locationCreateDto);
        location.setCreatedBy(currentUser);

        String normalizedName = location.getName().trim();

        // Execute with lock - ensures transaction commits before lock is released
        return executeWithLock(normalizedName, () -> {
            // Business layer uniqueness constraint
            locationValidator.checkNameUniqueness(location.getName());

            Location savedLocation = locationRepository.save(location);

            LocationDto dto = locationMapper.toDto(savedLocation);
            changeEventPublisher.publish("locations", ChangeEvent.Operation.CREATE, dto.getId());
            return dto;
        });
    }

    public LocationDto updateLocation(Long id, LocationUpdateDto locationUpdateDto, User currentUser) {
        Location existingLocation = locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));

        Long creatorId = existingLocation.getCreatedBy() != null ? existingLocation.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        locationMapper.updateEntity(existingLocation, locationUpdateDto);

        String normalizedName = existingLocation.getName().trim();

        // Execute with lock - ensures transaction commits before lock is released
        return executeWithLock(normalizedName, () -> {
            // Business layer uniqueness constraint
            locationValidator.checkNameUniqueness(existingLocation.getName());

            Location savedLocation = locationRepository.save(existingLocation);
            LocationDto dto = locationMapper.toDto(savedLocation);
            changeEventPublisher.publish("locations", ChangeEvent.Operation.UPDATE, dto.getId());
            return dto;
        });
    }

    @Transactional
    public DeleteResponse deleteLocation(Long id, User currentUser) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));

        Long creatorId = location.getCreatedBy() != null ? location.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        locationRepository.deleteById(id);
        changeEventPublisher.publish("locations", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Location deleted successfully")
                .build();
    }

    public Page<LocationDto> searchLocationsByName(String name, Pageable pageable) {
        return locationRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(locationMapper::toDto);
    }
}
