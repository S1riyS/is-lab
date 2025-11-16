package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.event.Event;
import com.itmo.ticketsystem.person.Person;
import com.itmo.ticketsystem.user.User;
import com.itmo.ticketsystem.venue.Venue;
import com.itmo.ticketsystem.common.TicketType;
import com.itmo.ticketsystem.coordinates.Coordinates;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    @Column(name = "version")
    private Long version;

    @Column(name = "name")
    @NotBlank(message = "Name cannot be blank")
    @NotNull(message = "Name cannot be null")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinates_id")
    @NotNull(message = "Coordinates cannot be null")
    private Coordinates coordinates;

    @Column(name = "creation_date")
    @NotNull(message = "Creation date cannot be null")
    private Date creationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    @NotNull(message = "Person cannot be null")
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "price")
    @Positive(message = "Price must be positive")
    private Float price;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TicketType type;

    @Column(name = "discount")
    @NotNull(message = "Discount cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount must be greater than 0")
    @DecimalMax(value = "100.0", message = "Discount must not exceed 100")
    private Double discount;

    @Column(name = "number")
    @Positive(message = "Number must be positive")
    private Double number;

    @Column(name = "comment")
    @NotBlank(message = "Comment cannot be blank")
    @NotNull(message = "Comment cannot be null")
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "updated_at")
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        if (creationDate == null) {
            creationDate = new Date();
        }
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
