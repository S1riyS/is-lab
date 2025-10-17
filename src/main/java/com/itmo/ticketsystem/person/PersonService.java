package com.itmo.ticketsystem.person;

import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonUpdateDto;
import com.itmo.ticketsystem.location.LocationRepository;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import com.itmo.ticketsystem.common.ws.ChangeEventPublisher;
import com.itmo.ticketsystem.common.ws.ChangeEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.common.UserRole;
import com.itmo.ticketsystem.common.exceptions.UnauthorizedException;
import com.itmo.ticketsystem.common.exceptions.ForbiddenException;

import java.util.List;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PersonMapper personMapper;

    @Autowired
    private ChangeEventPublisher changeEventPublisher;

    public Page<PersonDto> getAllPersons(Pageable pageable) {
        return personRepository.findAll(pageable).map(personMapper::toDto);
    }

    public PersonDto getPersonById(Long id) {
        return personRepository.findById(id)
                .map(personMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));
    }

    @Transactional
    public PersonDto createPerson(PersonCreateDto personCreateDto, User currentUser) {
        Person person = personMapper.toEntity(personCreateDto);
        person.setLocation(locationRepository.getReferenceById(personCreateDto.getLocationId()));
        person.setCreatedBy(currentUser);
        Person savedPerson = personRepository.save(person);
        PersonDto dto = personMapper.toDto(savedPerson);
        changeEventPublisher.publish("persons", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public PersonDto updatePerson(Long id, PersonUpdateDto personUpdateDto, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        Person existingPerson = personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));

        if (!UserRole.ADMIN.equals(currentUser.getRole()) &&
                (existingPerson.getCreatedBy() == null
                        || !existingPerson.getCreatedBy().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("Access denied");
        }

        personMapper.updateEntity(existingPerson, personUpdateDto);

        if (personUpdateDto.getLocationId() != null) {
            existingPerson.setLocation(locationRepository.getReferenceById(personUpdateDto.getLocationId()));
        }

        Person savedPerson = personRepository.save(existingPerson);
        PersonDto dto = personMapper.toDto(savedPerson);
        changeEventPublisher.publish("persons", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deletePerson(Long id, User currentUser) {
        if (currentUser == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));

        if (!UserRole.ADMIN.equals(currentUser.getRole()) &&
                (person.getCreatedBy() == null || !person.getCreatedBy().getId().equals(currentUser.getId()))) {
            throw new ForbiddenException("Access denied");
        }
        personRepository.deleteById(id);
        changeEventPublisher.publish("persons", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Person deleted successfully")
                .build();
    }

    public List<PersonDto> searchPersonsByPassportID(String passportID) {
        return personRepository.findByPassportIDContainingIgnoreCase(passportID).stream()
                .map(personMapper::toDto)
                .toList();
    }
}
