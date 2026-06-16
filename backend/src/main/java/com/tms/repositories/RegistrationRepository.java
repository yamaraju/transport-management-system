package com.tms.repositories;

import com.tms.models.Registration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUserId(Long userId);
    Page<Registration> findByUserId(Long userId, Pageable pageable);
    Optional<Registration> findByUserIdAndStatus(Long userId, String status);
    boolean existsByUserIdAndStatus(Long userId, String status);
    
    // For seat booking checks
    boolean existsByBusIdAndSeatIdAndStatus(Long busId, Long seatId, String status);
}
