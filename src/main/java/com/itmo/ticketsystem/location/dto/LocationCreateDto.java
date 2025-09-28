package com.itmo.ticketsystem.location.dto;

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

    private String name;
}
