package com.itmo.ticketsystem.person;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.common.service.EntityResolutionService;
import com.itmo.ticketsystem.common.service.Importer;
import com.itmo.ticketsystem.location.LocationService;
import com.itmo.ticketsystem.location.dto.LocationDto;
import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonImportDto;
import com.itmo.ticketsystem.user.User;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PersonImportService extends Importer<PersonImportDto> {

    private final PersonService personService;
    private final LocationService locationService;
    private final EntityResolutionService entityResolutionService;

    public PersonImportService(
            ObjectMapper objectMapper,
            Validator validator,
            PersonService personService,
            LocationService locationService,
            EntityResolutionService entityResolutionService) {
        super(PersonImportDto.class, objectMapper, validator);
        this.personService = personService;
        this.locationService = locationService;
        this.entityResolutionService = entityResolutionService;
    }

    @Override
    @Transactional
    protected int doImportInternal(PersonImportDto[] personDtos, User currentUser) throws Exception {

        List<Person> persons = new ArrayList<>();
        for (int i = 0; i < personDtos.length; i++) {
            PersonImportDto dto = personDtos[i];
            validateDto(dto, i);

            // Convert ImportDto to CreateDto and use existing PersonService
            PersonCreateDto createDto = new PersonCreateDto();
            createDto.setEyeColor(dto.getEyeColor());
            createDto.setHairColor(dto.getHairColor());
            createDto.setPassportID(dto.getPassportID());
            createDto.setNationality(dto.getNationality());

            // Create location
            LocationDto createdLocation = locationService.createLocation(dto.getLocation(), currentUser);
            createDto.setLocationId(createdLocation.getId());

            // Create person
            PersonDto createdPerson = personService.createPerson(createDto, currentUser);
            persons.add(entityResolutionService.resolvePerson(createdPerson.getId()));
        }

        return persons.size();
    }
}
