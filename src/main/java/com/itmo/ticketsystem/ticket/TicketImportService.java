package com.itmo.ticketsystem.ticket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.coordinates.CoordinatesService;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesDto;
import com.itmo.ticketsystem.event.EventService;
import com.itmo.ticketsystem.event.dto.EventDto;
import com.itmo.ticketsystem.location.LocationService;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.person.PersonService;
import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonImportDto;
import com.itmo.ticketsystem.ticket.dto.TicketCreateDto;
import com.itmo.ticketsystem.ticket.dto.TicketImportDto;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.venue.VenueService;
import com.itmo.ticketsystem.venue.dto.VenueDto;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TicketImportService extends Importer<TicketImportDto> {

    private final TicketService ticketService;
    private final CoordinatesService coordinatesService;
    private final PersonService personService;
    private final EventService eventService;
    private final VenueService venueService;
    private final LocationService locationService;

    public TicketImportService(
            ObjectMapper objectMapper,
            Validator validator,
            TicketService ticketService,
            CoordinatesService coordinatesService,
            PersonService personService,
            EventService eventService,
            VenueService venueService,
            LocationService locationService) {
        super(TicketImportDto.class, objectMapper, validator);
        this.ticketService = ticketService;
        this.coordinatesService = coordinatesService;
        this.personService = personService;
        this.eventService = eventService;
        this.venueService = venueService;
        this.locationService = locationService;
    }

    @Override
    @Transactional
    protected int doImportInternal(TicketImportDto[] ticketDtos, User currentUser) throws Exception {
        int count = 0;
        for (int i = 0; i < ticketDtos.length; i++) {
            TicketImportDto importDto = ticketDtos[i];
            validateDto(importDto, i);

            // Create nested entities through service layer
            CoordinatesDto coordinates = coordinatesService.createCoordinates(importDto.getCoordinates(), currentUser);

            // Create nested location for person
            LocationDto location = locationService.createLocation(importDto.getPerson().getLocation(), currentUser);

            // Create nested person
            PersonCreateDto personCreateDto = buildPersonCreateDto(importDto.getPerson(), location.getId());
            PersonDto person = personService.createPerson(personCreateDto, currentUser);

            // Create nested event if present
            Long eventId = null;
            if (importDto.getEvent() != null) {
                EventDto event = eventService.createEvent(importDto.getEvent(), currentUser);
                eventId = event.getId();
            }

            // Create nested venue if present
            Long venueId = null;
            if (importDto.getVenue() != null) {
                VenueDto venue = venueService.createVenue(importDto.getVenue(), currentUser);
                venueId = venue.getId();
            }

            // Build TicketCreateDto with IDs of created nested entities
            TicketCreateDto ticketCreateDto = buildTicketCreateDto(
                    importDto,
                    coordinates.getId(),
                    person.getId(),
                    eventId,
                    venueId);

            // Use service layer to enforce business logic and uniqueness constraints
            ticketService.createTicket(ticketCreateDto, currentUser);
            count++;
        }

        return count;
    }

    private PersonCreateDto buildPersonCreateDto(PersonImportDto importDto, Long locationId) {
        PersonCreateDto createDto = new PersonCreateDto();
        createDto.setEyeColor(importDto.getEyeColor());
        createDto.setHairColor(importDto.getHairColor());
        createDto.setPassportID(importDto.getPassportID());
        createDto.setNationality(importDto.getNationality());
        createDto.setLocationId(locationId);
        return createDto;
    }

    private TicketCreateDto buildTicketCreateDto(
            TicketImportDto importDto,
            Long coordinatesId,
            Long personId,
            Long eventId,
            Long venueId) {
        TicketCreateDto createDto = new TicketCreateDto();
        createDto.setName(importDto.getName());
        createDto.setCoordinatesId(coordinatesId);
        createDto.setCreationDate(importDto.getCreationDate());
        createDto.setPersonId(personId);
        createDto.setEventId(eventId);
        createDto.setPrice(importDto.getPrice());
        createDto.setType(importDto.getType());
        createDto.setDiscount(importDto.getDiscount());
        createDto.setNumber(importDto.getNumber());
        createDto.setComment(importDto.getComment());
        createDto.setVenueId(venueId);
        return createDto;
    }
}
