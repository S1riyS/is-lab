package com.itmo.ticketsystem.event;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    @NotBlank(message = "Event name cannot be blank")
    @NotNull(message = "Event name cannot be null")
    private String name;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "min_age")
    @Positive(message = "Minimum age must be positive")
    private Long minAge;

    @Column(name = "description")
    @NotNull(message = "Description cannot be null")
    private String description;
}
