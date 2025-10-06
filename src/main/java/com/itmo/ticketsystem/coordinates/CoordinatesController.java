package com.itmo.ticketsystem.coordinates;

import com.itmo.ticketsystem.coordinates.dto.CoordinatesCreateDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/coordinates")
@CrossOrigin(origins = "*")
public class CoordinatesController {

    @Autowired
    private CoordinatesService coordinatesService;

    @GetMapping
    public ResponseEntity<Page<CoordinatesDto>> getAllCoordinates(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        Page<CoordinatesDto> coordinates = coordinatesService.getAllCoordinates(pageable);
        return ResponseEntity.ok(coordinates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoordinatesDto> getCoordinatesById(@PathVariable Long id) {
        CoordinatesDto coordinates = coordinatesService.getCoordinatesById(id);
        return ResponseEntity.ok(coordinates);
    }

    @PostMapping
    public ResponseEntity<CoordinatesDto> createCoordinates(
            @Valid @RequestBody CoordinatesCreateDto coordinatesCreateDto) {
        CoordinatesDto createdCoordinates = coordinatesService.createCoordinates(coordinatesCreateDto);
        return ResponseEntity.ok(createdCoordinates);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoordinatesDto> updateCoordinates(@PathVariable Long id,
            @Valid @RequestBody CoordinatesUpdateDto coordinatesUpdateDto) {
        CoordinatesDto updatedCoordinates = coordinatesService.updateCoordinates(id, coordinatesUpdateDto,
                getCurrentUser());
        return ResponseEntity.ok(updatedCoordinates);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteCoordinates(@PathVariable Long id) {
        DeleteResponse response = coordinatesService.deleteCoordinates(id, getCurrentUser());
        return ResponseEntity.ok(response);
    }

    private com.itmo.ticketsystem.user.User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return new com.itmo.ticketsystem.user.User();
        }
        return null;
    }
}
