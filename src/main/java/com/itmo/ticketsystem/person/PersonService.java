package com.itmo.ticketsystem.person;

import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonUpdateDto;
import com.itmo.ticketsystem.location.LocationRepository;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PersonMapper personMapper;

    public Page<PersonDto> getAllPersons(Pageable pageable) {
        return personRepository.findAll(pageable).map(personMapper::toDto);
    }

    public PersonDto getPersonById(Long id) {
        return personRepository.findById(id)
                .map(personMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));
    }

    @Transactional
    public PersonDto createPerson(PersonCreateDto personCreateDto) {
        Person person = personMapper.toEntity(personCreateDto);
        person.setLocation(locationRepository.getReferenceById(personCreateDto.getLocationId()));
        Person savedPerson = personRepository.save(person);
        return personMapper.toDto(savedPerson);
    }

    @Transactional
    public PersonDto updatePerson(Long id, PersonUpdateDto personUpdateDto) {
        Person existingPerson = personRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Person not found with ID: " + id));

        personMapper.updateEntity(existingPerson, personUpdateDto);

        if (personUpdateDto.getLocationId() != null) {
            existingPerson.setLocation(locationRepository.getReferenceById(personUpdateDto.getLocationId()));
        }

        Person savedPerson = personRepository.save(existingPerson);
        return personMapper.toDto(savedPerson);
    }

    @Transactional
    public DeleteResponse deletePerson(Long id) {
        if (!personRepository.existsById(id)) {
            throw new NotFoundException("Person not found with ID: " + id);
        }
        personRepository.deleteById(id);
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
