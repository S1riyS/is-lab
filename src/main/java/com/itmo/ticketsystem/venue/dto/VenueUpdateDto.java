package com.itmo.ticketsystem.venue.dto;

import com.itmo.ticketsystem.common.VenueType;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueUpdateDto {

    private String name;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private VenueType type;
}
