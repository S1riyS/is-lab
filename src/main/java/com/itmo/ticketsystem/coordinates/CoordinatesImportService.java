package com.itmo.ticketsystem.coordinates;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesCreateDto;
import com.itmo.ticketsystem.user.User;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CoordinatesImportService extends Importer<CoordinatesCreateDto> {

    private final CoordinatesService coordinatesService;

    public CoordinatesImportService(
            ObjectMapper objectMapper,
            Validator validator,
            CoordinatesService coordinatesService) {
        super(CoordinatesCreateDto.class, objectMapper, validator);
        this.coordinatesService = coordinatesService;
    }

    @Override
    @Transactional
    protected int doImportInternal(CoordinatesCreateDto[] coordinatesDtos, User currentUser) throws Exception {
        int count = 0;
        for (int i = 0; i < coordinatesDtos.length; i++) {
            CoordinatesCreateDto dto = coordinatesDtos[i];
            validateDto(dto, i);

            // Use service layer to enforce business logic and uniqueness constraints
            coordinatesService.createCoordinates(dto, currentUser);
            count++;
        }

        return count;
    }
}
