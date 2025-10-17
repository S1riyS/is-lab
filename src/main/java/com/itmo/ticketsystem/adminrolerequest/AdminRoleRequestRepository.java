package com.itmo.ticketsystem.adminrolerequest;

import com.itmo.ticketsystem.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRoleRequestRepository extends JpaRepository<AdminRoleRequest, Long> {

    @Query("SELECT arr FROM AdminRoleRequest arr WHERE arr.user = :user AND arr.status = 'PENDING'")
    Optional<AdminRoleRequest> findPendingRequestByUser(@Param("user") User user);

    Page<AdminRoleRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT arr FROM AdminRoleRequest arr WHERE arr.status = :status ORDER BY arr.createdAt DESC")
    Page<AdminRoleRequest> findByStatus(@Param("status") AdminRoleRequestStatus status, Pageable pageable);
}
