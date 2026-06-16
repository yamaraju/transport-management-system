package com.tms.repositories;

import com.tms.models.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByRegistrationId(Long registrationId);
    
    @Query("SELECT p FROM Payment p WHERE p.registration.user.id = :userId")
    List<Payment> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Payment p WHERE p.registration.user.id = :userId")
    Page<Payment> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double sumTotalRevenue();
}
