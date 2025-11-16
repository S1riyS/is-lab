package com.itmo.ticketsystem.person;

import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonUpdateDto;
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
public class PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;
    private final ChangeEventPublisher changeEventPublisher;
    private final AuthorizationService authorizationService;

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
        authorizationService.requireAuthenticated(currentUser);

        Person person = personMapper.toEntity(personCreateDto);
        person.setCreatedBy(currentUser);
        Person savedPerson = personRepository.save(person);
        PersonDto dto = personMapper.toDto(savedPerson);
        changeEventPublisher.publish("persons", ChangeEvent.Operation.CREATE, dto.getId());
        return dto;
    }

    @Transactional
    public PersonDto updatePerson(Long id, PersonUpdateDto personUpdateDto, User currentUser) {
        Person existingPerson = personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));

        Long creatorId = existingPerson.getCreatedBy() != null ? existingPerson.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        personMapper.updateEntity(existingPerson, personUpdateDto);
        Person savedPerson = personRepository.save(existingPerson);
        PersonDto dto = personMapper.toDto(savedPerson);
        changeEventPublisher.publish("persons", ChangeEvent.Operation.UPDATE, dto.getId());
        return dto;
    }

    @Transactional
    public DeleteResponse deletePerson(Long id, User currentUser) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));

        Long creatorId = person.getCreatedBy() != null ? person.getCreatedBy().getId() : null;
        authorizationService.requireCanModifyOrAdmin(currentUser, creatorId);

        personRepository.deleteById(id);
        changeEventPublisher.publish("persons", ChangeEvent.Operation.DELETE, id);
        return DeleteResponse.builder()
                .message("Person deleted successfully")
                .build();
    }

    public Page<PersonDto> searchPersonsByPassportID(String passportID, Pageable pageable) {
        return personRepository.findByPassportIDContainingIgnoreCase(passportID, pageable)
                .map(personMapper::toDto);
    }
}
