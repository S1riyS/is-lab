package com.itmo.ticketsystem.location;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import com.itmo.ticketsystem.user.User;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocationImportService extends Importer<LocationCreateDto> {

    private final LocationService locationService;

    public LocationImportService(
            ObjectMapper objectMapper,
            Validator validator,
            LocationService locationService) {
        super(LocationCreateDto.class, objectMapper, validator);
        this.locationService = locationService;
    }

    @Override
    @Transactional
    protected int doImportInternal(LocationCreateDto[] locationDtos, User currentUser) throws Exception {
        int count = 0;
        for (int i = 0; i < locationDtos.length; i++) {
            LocationCreateDto dto = locationDtos[i];
            validateDto(dto, i);

            // Use service layer to enforce business logic and uniqueness constraints
            locationService.createLocation(dto, currentUser);
            count++;
        }

        return count;
    }
}
