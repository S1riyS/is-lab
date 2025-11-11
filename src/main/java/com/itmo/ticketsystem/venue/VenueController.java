package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.venue.dto.VenueCreateDto;
import com.itmo.ticketsystem.venue.dto.VenueDto;
import com.itmo.ticketsystem.venue.dto.VenueUpdateDto;
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
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController extends BaseController {

    private final VenueService venueService;

    @GetMapping
    public ResponseEntity<Page<VenueDto>> getAllVenues(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<VenueDto> venues;
        if (search != null && !search.trim().isEmpty()) {
            venues = venueService.searchVenuesByName(search, pageable);
        } else {
            venues = venueService.getAllVenues(pageable);
        }
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueDto> getVenueById(@PathVariable Long id) {
        VenueDto venue = venueService.getVenueById(id);
        return ResponseEntity.ok(venue);
    }

    @PostMapping
    public ResponseEntity<VenueDto> createVenue(@Valid @RequestBody VenueCreateDto venueCreateDto) {
        VenueDto createdVenue = venueService.createVenue(venueCreateDto, getCurrentUser());
        return ResponseEntity.ok(createdVenue);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VenueDto> updateVenue(@PathVariable Long id,
            @Valid @RequestBody VenueUpdateDto venueUpdateDto) {
        VenueDto updatedVenue = venueService.updateVenue(id, venueUpdateDto, getCurrentUser());
        return ResponseEntity.ok(updatedVenue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteVenue(@PathVariable Long id) {
        DeleteResponse response = venueService.deleteVenue(id, getCurrentUser());
        return ResponseEntity.ok(response);
    }
}
