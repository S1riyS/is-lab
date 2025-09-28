package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.venue.dto.VenueCreateDto;
import com.itmo.ticketsystem.venue.dto.VenueDto;
import com.itmo.ticketsystem.venue.dto.VenueUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private VenueMapper venueMapper;

    public Page<VenueDto> getAllVenues(Pageable pageable) {
        return venueRepository.findAll(pageable).map(venueMapper::toDto);
    }

    public VenueDto getVenueById(Long id) {
        return venueRepository.findById(id)
                .map(venueMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));
    }

    @Transactional
    public VenueDto createVenue(VenueCreateDto venueCreateDto) {
        Venue venue = venueMapper.toEntity(venueCreateDto);
        Venue savedVenue = venueRepository.save(venue);
        return venueMapper.toDto(savedVenue);
    }

    @Transactional
    public VenueDto updateVenue(Long id, VenueUpdateDto venueUpdateDto) {
        Venue existingVenue = venueRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue not found with ID: " + id));

        venueMapper.updateEntity(existingVenue, venueUpdateDto);
        Venue savedVenue = venueRepository.save(existingVenue);
        return venueMapper.toDto(savedVenue);
    }

    @Transactional
    public DeleteResponse deleteVenue(Long id) {
        if (!venueRepository.existsById(id)) {
            throw new NotFoundException("Venue not found with ID: " + id);
        }
        venueRepository.deleteById(id);
        return DeleteResponse.builder()
                .message("Venue deleted successfully")
                .build();
    }

    public List<VenueDto> searchVenuesByName(String name) {
        return venueRepository.findByNameContainingIgnoreCase(name).stream()
                .map(venueMapper::toDto)
                .toList();
    }
}
