package com.itmo.ticketsystem.person;

import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonUpdateDto;
import com.itmo.ticketsystem.common.controller.BaseController;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/persons")
@RequiredArgsConstructor
public class PersonController extends BaseController {

    private final PersonService personService;

    @GetMapping
    public ResponseEntity<Page<PersonDto>> getAllPersons(
            @PageableDefault(size = 10, sort = "id") Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<PersonDto> persons;
        if (search != null && !search.trim().isEmpty()) {
            persons = personService.searchPersonsByPassportID(search, pageable);
        } else {
            persons = personService.getAllPersons(pageable);
        }
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonDto> getPersonById(@PathVariable Long id) {
        PersonDto person = personService.getPersonById(id);
        return ResponseEntity.ok(person);
    }

    @PostMapping
    public ResponseEntity<PersonDto> createPerson(@Valid @RequestBody PersonCreateDto personCreateDto) {
        PersonDto createdPerson = personService.createPerson(personCreateDto, getCurrentUser());
        return ResponseEntity.ok(createdPerson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDto> updatePerson(@PathVariable Long id,
            @Valid @RequestBody PersonUpdateDto personUpdateDto) {
        PersonDto updatedPerson = personService.updatePerson(id, personUpdateDto, getCurrentUser());
        return ResponseEntity.ok(updatedPerson);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deletePerson(@PathVariable Long id) {
        DeleteResponse response = personService.deletePerson(id, getCurrentUser());
        return ResponseEntity.ok(response);
    }
}
