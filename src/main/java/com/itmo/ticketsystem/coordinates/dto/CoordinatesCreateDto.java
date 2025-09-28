package com.itmo.ticketsystem.coordinates.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesCreateDto {

    @Max(value = 314, message = "X coordinate must not exceed 314")
    private Integer x;

    @NotNull(message = "Y coordinate cannot be null")
    private Float y;
}
