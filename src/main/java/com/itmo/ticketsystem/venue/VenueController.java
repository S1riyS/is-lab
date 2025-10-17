package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.venue.dto.VenueCreateDto;
import com.itmo.ticketsystem.venue.dto.VenueDto;
import com.itmo.ticketsystem.venue.dto.VenueUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.itmo.ticketsystem.user.User;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "*")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @GetMapping
    public ResponseEntity<Page<VenueDto>> getAllVenues(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<VenueDto> venues;
        if (search != null && !search.trim().isEmpty()) {
            List<VenueDto> venueList = venueService.searchVenuesByName(search);
            venues = PaginationUtil.createPageFromList(venueList, pageable);
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

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }
}
