package com.itmo.ticketsystem.location;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import jakarta.persistence.QueryHint;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // @QueryHints({
    //         @QueryHint(name = "org.hibernate.cacheable", value = "true")
    // })
    @Override
    Page<Location> findAll(Pageable pageable);

    // @QueryHints({
    //         @QueryHint(name = "org.hibernate.cacheable", value = "true")
    // })
    Page<Location> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByName(String name);
}
