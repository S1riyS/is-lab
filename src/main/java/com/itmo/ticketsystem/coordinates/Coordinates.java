package com.itmo.ticketsystem.coordinates;

import java.util.ArrayList;
import java.util.List;

import com.itmo.ticketsystem.ticket.Ticket;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "coordinates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coordinates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x")
    @Max(value = 314, message = "X coordinate must not exceed 314")
    private Integer x;

    @Column(name = "y")
    @NotNull(message = "Y coordinate cannot be null")
    private Float y;

    @OneToMany(mappedBy = "coordinates", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();
}
