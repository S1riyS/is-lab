package com.itmo.ticketsystem.location;

import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.location.dto.LocationUpdateDto;
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
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private LocationMapper locationMapper;

    @Autowired
    private ChangeEventPublisher changeEventPublisher;

    public Page<LocationDto> getAllLocations(Pageable pageable) {
        return locationRepository.findAll(pageable).map(locationMapper::toDto);
    }

    public LocationDto getLocationById(Long id) {
        return locationRepository.findById(id)
                .map(locationMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));
    }

    @Transactional
    public LocationDto createLocation(LocationCreateDto locationCreateDto) {
        Location location = locationMapper.toEntity(locationCreateDto);
        Location savedLocation = locationRepository.save(location);
        LocationDto dto = locationMapper.toDto(savedLocation);
        changeEventPublisher.publish("locations", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public LocationDto updateLocation(Long id, LocationUpdateDto locationUpdateDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        if (!currentUser.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenException("Admin role required");
        }
        Location existingLocation = locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));

        locationMapper.updateEntity(existingLocation, locationUpdateDto);
        Location savedLocation = locationRepository.save(existingLocation);
        LocationDto dto = locationMapper.toDto(savedLocation);
        changeEventPublisher.publish("locations", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteLocation(Long id, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        if (!currentUser.getRole().equals(UserRole.ADMIN)) {
            throw new ForbiddenException("Admin role required");
        }
        if (!locationRepository.existsById(id)) {
            throw new NotFoundException("Location not found with ID: " + id);
        }
        locationRepository.deleteById(id);
        changeEventPublisher.publish("locations", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Location deleted successfully")
                .build();
    }

    public List<LocationDto> searchLocationsByName(String name) {
        return locationRepository.findByNameContainingIgnoreCase(name).stream()
                .map(locationMapper::toDto)
                .toList();
    }
}
