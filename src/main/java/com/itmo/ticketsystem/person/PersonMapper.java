package com.itmo.ticketsystem.person;

import com.itmo.ticketsystem.person.dto.PersonCreateDto;
import com.itmo.ticketsystem.person.dto.PersonDto;
import com.itmo.ticketsystem.person.dto.PersonUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class PersonMapper {

    public PersonDto toDto(Person person) {
        if (person == null) {
            return null;
        }

        PersonDto dto = new PersonDto();
        dto.setId(person.getId());
        dto.setEyeColor(person.getEyeColor());
        dto.setHairColor(person.getHairColor());
        dto.setLocationId(person.getLocation() != null ? person.getLocation().getId() : null);
        dto.setPassportID(person.getPassportID());
        dto.setNationality(person.getNationality());
        return dto;
    }

    public Person toEntity(PersonCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        Person person = new Person();
        person.setEyeColor(createDto.getEyeColor());
        person.setHairColor(createDto.getHairColor());
        person.setPassportID(createDto.getPassportID());
        person.setNationality(createDto.getNationality());
        return person;
    }

    public void updateEntity(Person existingEntity, PersonUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getEyeColor() != null) {
            existingEntity.setEyeColor(updateDto.getEyeColor());
        }
        if (updateDto.getHairColor() != null) {
            existingEntity.setHairColor(updateDto.getHairColor());
        }
        if (updateDto.getPassportID() != null) {
            existingEntity.setPassportID(updateDto.getPassportID());
        }
        if (updateDto.getNationality() != null) {
            existingEntity.setNationality(updateDto.getNationality());
        }
    }
}
