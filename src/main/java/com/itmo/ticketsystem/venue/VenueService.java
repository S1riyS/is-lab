package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.venue.dto.VenueCreateDto;
import com.itmo.ticketsystem.venue.dto.VenueDto;
import com.itmo.ticketsystem.venue.dto.VenueUpdateDto;
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
public class VenueService {

    private final VenueRepository venueRepository;
    private final VenueMapper venueMapper;
    private final VenueValidator venueValidator;

    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;

    public Page<VenueDto> getAllVenues(Pageable pageable) {
        return venueRepository.findAll(pageable).map(venueMapper::toDto);
    }

    public VenueDto getVenueById(Long id) {
        return venueRepository.findById(id)
                .map(venueMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));
    }

    @Transactional
    public VenueDto createVenue(VenueCreateDto venueCreateDto, User currentUser) {
        authorizationService.requireAuthenticated(currentUser);

        Venue venue = venueMapper.toEntity(venueCreateDto);
        venue.setCreatedBy(currentUser);

        // Business layer uniqueness constraint
        venueValidator.checkNameUniqueness(venue.getName());

        Venue savedVenue = venueRepository.save(venue);

        VenueDto dto = venueMapper.toDto(savedVenue);
        changeEventPublisher.publish("venues", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public VenueDto updateVenue(Long id, VenueUpdateDto venueUpdateDto, User currentUser) {
        Venue existingVenue = venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));

        Long creatorId = existingVenue.getCreatedBy() != null ? existingVenue.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        venueMapper.updateEntity(existingVenue, venueUpdateDto);
        
        // Business layer uniqueness constraint
        venueValidator.checkNameUniqueness(existingVenue.getName());

        Venue savedVenue = venueRepository.save(existingVenue);
        VenueDto dto = venueMapper.toDto(savedVenue);
        changeEventPublisher.publish("venues", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deleteVenue(Long id, User currentUser) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));

        Long creatorId = venue.getCreatedBy() != null ? venue.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        venueRepository.deleteById(id);
        changeEventPublisher.publish("venues", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Venue deleted successfully")
                .build();
    }

    public Page<VenueDto> searchVenuesByName(String name, Pageable pageable) {
        return venueRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(venueMapper::toDto);
    }
}
