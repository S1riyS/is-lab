package com.itmo.ticketsystem.coordinates.dto;

import jakarta.validation.constraints.Max;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesUpdateDto {

    @Max(value = 314, message = "X coordinate must not exceed 314")
    private Integer x;

    private Float y;
}
