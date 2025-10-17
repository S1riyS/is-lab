package com.itmo.ticketsystem.person;

import com.itmo.ticketsystem.common.Color;
import com.itmo.ticketsystem.common.Country;
import com.itmo.ticketsystem.location.Location;
import com.itmo.ticketsystem.ticket.Ticket;
import com.itmo.ticketsystem.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "persons", uniqueConstraints = @UniqueConstraint(columnNames = "passport_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "eye_color")
    private Color eyeColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color")
    private Color hairColor;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    @NotNull(message = "Location cannot be null")
    private Location location;

    @Column(name = "passport_id", unique = true)
    @NotNull(message = "Passport ID cannot be null")
    @Size(min = 10, max = 28, message = "Passport ID must be between 10 and 28 characters")
    private String passportID;

    @Enumerated(EnumType.STRING)
    @Column(name = "nationality")
    @NotNull(message = "Nationality cannot be null")
    private Country nationality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();
}
