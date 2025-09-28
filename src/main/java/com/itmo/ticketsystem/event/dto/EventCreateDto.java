package com.itmo.ticketsystem.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventCreateDto {

    @NotBlank(message = "Event name cannot be blank")
    @NotNull(message = "Event name cannot be null")
    private String name;

    private ZonedDateTime date;

    @Positive(message = "Minimum age must be positive")
    private Long minAge;

    @NotNull(message = "Description cannot be null")
    private String description;
}
