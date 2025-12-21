package com.itmo.ticketsystem.importhistory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itmo.ticketsystem.common.EntityType;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.coordinates.CoordinatesImportService;
import com.itmo.ticketsystem.event.EventImportService;
import com.itmo.ticketsystem.importhistory.dto.ImportRequestDto;
import com.itmo.ticketsystem.location.LocationImportService;
import com.itmo.ticketsystem.person.PersonImportService;
import com.itmo.ticketsystem.ticket.TicketImportService;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.venue.VenueImportService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ImportExecutor {
    private final TicketImportService ticketImportService;
    private final EventImportService eventImportService;
    private final VenueImportService venueImportService;
    private final PersonImportService personImportService;
    private final LocationImportService locationImportService;
    private final CoordinatesImportService coordinatesImportService;

    @Transactional
    public int executeImport(ImportRequestDto importRequest, User currentUser) {
        Importer<?> importer = getImporter(importRequest.getEntityType());
        try {
            return importer.doImport(importRequest.getData(), currentUser);
        } catch (Exception e) {
            throw new RuntimeException("Import failed: " + e.getMessage(), e);
        }
    }

    private Importer<?> getImporter(EntityType entityType) {
        return switch (entityType) {
            case TICKET -> ticketImportService;
            case EVENT -> eventImportService;
            case VENUE -> venueImportService;
            case PERSON -> personImportService;
            case LOCATION -> locationImportService;
            case COORDINATES -> coordinatesImportService;
            default -> throw new IllegalArgumentException("Unsupported entity type: " + entityType);
        };
    }
}
