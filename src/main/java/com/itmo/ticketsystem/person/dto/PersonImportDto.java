package com.itmo.ticketsystem.person.dto;

import com.itmo.ticketsystem.common.Color;
import com.itmo.ticketsystem.common.Country;
import com.itmo.ticketsystem.location.dto.LocationCreateDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonImportDto {

    private Color eyeColor;
    private Color hairColor;

    @NotNull(message = "Location cannot be null")
    @Valid
    private LocationCreateDto location;

    @NotNull(message = "Passport ID cannot be null")
    @Size(min = 10, max = 28, message = "Passport ID must be between 10 and 28 characters")
    private String passportID;

    @NotNull(message = "Nationality cannot be null")
    private Country nationality;
}
