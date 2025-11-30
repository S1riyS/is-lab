package com.itmo.ticketsystem.location.dto;

import com.itmo.ticketsystem.common.validation.UniqueField;
import com.itmo.ticketsystem.location.LocationRepository;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdateDto {

    private Long x;
    private Float y;
    private Long z;

    @UniqueField(repositoryClass = LocationRepository.class, fieldName = "name", message = "Location name must be unique")
    private String name;
}
