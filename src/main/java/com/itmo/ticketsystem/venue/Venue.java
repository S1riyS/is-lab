package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.common.VenueType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "venues")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    @NotBlank(message = "Venue name cannot be blank")
    @NotNull(message = "Venue name cannot be null")
    private String name;

    @Column(name = "capacity")
    @NotNull(message = "Capacity cannot be null")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    @NotNull(message = "Venue type cannot be null")
    private VenueType type;
}
