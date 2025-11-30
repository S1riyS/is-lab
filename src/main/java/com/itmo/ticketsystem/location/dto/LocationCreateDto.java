package com.itmo.ticketsystem.location.dto;

import com.itmo.ticketsystem.common.validation.UniqueField;
import com.itmo.ticketsystem.location.LocationRepository;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationCreateDto {

    private Long x;

    @NotNull(message = "Y coordinate cannot be null")
    private Float y;

    @NotNull(message = "Z coordinate cannot be null")
    private Long z;

    @UniqueField(repositoryClass = LocationRepository.class, fieldName = "name", message = "Location name must be unique")
    private String name;
}
