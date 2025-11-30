package com.itmo.ticketsystem.venue.dto;

import com.itmo.ticketsystem.common.VenueType;
import com.itmo.ticketsystem.common.validation.UniqueField;
import com.itmo.ticketsystem.venue.VenueRepository;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueUpdateDto {

    @UniqueField(
        repositoryClass = VenueRepository.class,
        fieldName = "name",
        message = "Venue name must be unique"
    )
    private String name;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private VenueType type;
}
