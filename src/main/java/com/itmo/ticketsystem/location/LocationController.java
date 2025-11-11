package com.itmo.ticketsystem.location;

import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.location.dto.LocationUpdateDto;
import com.itmo.ticketsystem.common.controller.BaseController;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController extends BaseController {

    private final LocationService locationService;

    @GetMapping
    public ResponseEntity<Page<LocationDto>> getAllLocations(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<LocationDto> locations;
        if (search != null && !search.trim().isEmpty()) {
            locations = locationService.searchLocationsByName(search, pageable);
        } else {
            locations = locationService.getAllLocations(pageable);
        }
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationDto> getLocationById(@PathVariable Long id) {
        LocationDto location = locationService.getLocationById(id);
        return ResponseEntity.ok(location);
    }

    @PostMapping
    public ResponseEntity<LocationDto> createLocation(@Valid @RequestBody LocationCreateDto locationCreateDto) {
        LocationDto createdLocation = locationService.createLocation(locationCreateDto, getCurrentUser());
        return ResponseEntity.ok(createdLocation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocationDto> updateLocation(@PathVariable Long id,
            @Valid @RequestBody LocationUpdateDto locationUpdateDto) {
        LocationDto updatedLocation = locationService.updateLocation(id, locationUpdateDto, getCurrentUser());
        return ResponseEntity.ok(updatedLocation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteLocation(@PathVariable Long id) {
        DeleteResponse response = locationService.deleteLocation(id, getCurrentUser());
        return ResponseEntity.ok(response);
    }
}
