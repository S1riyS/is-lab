package com.itmo.ticketsystem.venue.dto;

import com.itmo.ticketsystem.common.VenueType;
import com.itmo.ticketsystem.common.validation.UniqueField;
import com.itmo.ticketsystem.venue.VenueRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueCreateDto {

    @NotBlank(message = "Venue name cannot be blank")
    @NotNull(message = "Venue name cannot be null")
    @UniqueField(repositoryClass = VenueRepository.class, fieldName = "name", message = "Venue name must be unique")
    private String name;

    @NotNull(message = "Capacity cannot be null")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @NotNull(message = "Venue type cannot be null")
    private VenueType type;
}
