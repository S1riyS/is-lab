package com.itmo.ticketsystem.importhistory;

import com.itmo.ticketsystem.common.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Long> {

    List<ImportHistory> findByUserIdAndEntityTypeOrderByCreatedAtDesc(Long userId, EntityType entityType);

    List<ImportHistory> findByEntityTypeOrderByCreatedAtDesc(EntityType entityType);
}
