package com.itmo.ticketsystem.venue;

import com.itmo.ticketsystem.common.VenueType;
import com.itmo.ticketsystem.ticket.Ticket;
import com.itmo.ticketsystem.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venues")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets = new ArrayList<>();
}
