package com.itmo.ticketsystem.location.dto;

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
    private String name;
}
