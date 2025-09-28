package com.itmo.ticketsystem.event.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventUpdateDto {

    private String name;
    private ZonedDateTime date;

    @Positive(message = "Minimum age must be positive")
    private Long minAge;

    private String description;
}
