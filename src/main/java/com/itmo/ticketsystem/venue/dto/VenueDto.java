package com.itmo.ticketsystem.venue.dto;

import com.itmo.ticketsystem.common.VenueType;
import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class VenueDto extends BaseEntityDto {

    @NotBlank(message = "Venue name cannot be blank")
    @NotNull(message = "Venue name cannot be null")
    private String name;

    @NotNull(message = "Capacity cannot be null")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @NotNull(message = "Venue type cannot be null")
    private VenueType type;
}
