package com.itmo.ticketsystem.venue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.venue.dto.VenueCreateDto;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VenueImportService extends Importer<VenueCreateDto> {

    private final VenueService venueService;

    public VenueImportService(
            ObjectMapper objectMapper,
            Validator validator,
            VenueService venueService) {
        super(VenueCreateDto.class, objectMapper, validator);
        this.venueService = venueService;
    }

    @Override
    @Transactional
    protected int doImportInternal(VenueCreateDto[] venueDtos, User currentUser) throws Exception {
        int count = 0;
        for (int i = 0; i < venueDtos.length; i++) {
            VenueCreateDto dto = venueDtos[i];
            validateDto(dto, i);

            // Use service layer to enforce business logic and uniqueness constraints
            venueService.createVenue(dto, currentUser);
            count++;
        }

        return count;
    }
}
