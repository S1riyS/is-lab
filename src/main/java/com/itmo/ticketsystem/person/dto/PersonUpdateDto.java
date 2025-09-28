package com.itmo.ticketsystem.person.dto;

import com.itmo.ticketsystem.common.Color;
import com.itmo.ticketsystem.common.Country;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonUpdateDto {

    private Color eyeColor;
    private Color hairColor;
    private Long locationId;

    @Size(min = 10, max = 28, message = "Passport ID must be between 10 and 28 characters")
    private String passportID;

    private Country nationality;
}
