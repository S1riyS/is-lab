package com.itmo.ticketsystem.location;

import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.location.dto.LocationUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private LocationMapper locationMapper;

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
        return locationMapper.toDto(savedLocation);
    }

    @Transactional
    public LocationDto updateLocation(Long id, LocationUpdateDto locationUpdateDto) {
        Location existingLocation = locationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Location not found with ID: " + id));

        locationMapper.updateEntity(existingLocation, locationUpdateDto);
        Location savedLocation = locationRepository.save(existingLocation);
        return locationMapper.toDto(savedLocation);
    }

    @Transactional
    public DeleteResponse deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new NotFoundException("Location not found with ID: " + id);
        }
        locationRepository.deleteById(id);
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
