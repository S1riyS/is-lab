package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.venue.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE t.venue = :venue")
    List<Ticket> findByVenue(@Param("venue") Venue venue);

    @Query("SELECT t FROM Ticket t WHERE LENGTH(t.comment) > :length")
    List<Ticket> findByCommentLengthGreaterThan(@Param("length") Integer length);

    @Query("SELECT t.name, COUNT(t) FROM Ticket t GROUP BY t.name")
    List<Object[]> groupByName();

    @Query("SELECT t FROM Ticket t WHERE t.event.id = :eventId")
    List<Ticket> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT t FROM Ticket t WHERE t.venue.id = :venueId")
    List<Ticket> findByVenueId(@Param("venueId") Long venueId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.event.id = :eventId")
    long countByEventId(@Param("eventId") Long eventId);
}
