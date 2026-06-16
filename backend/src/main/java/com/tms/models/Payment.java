package com.tms.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @NotNull
    @Column(nullable = false)
    private Double amount;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @NotBlank
    @Column(nullable = false)
    private String paymentMethod; // "CARD", "NET_BANKING", "UPI"

    @NotBlank
    @Column(nullable = false)
    private String status; // "SUCCESS", "FAILED"

    @NotBlank
    @Column(unique = true, nullable = false)
    private String transactionId;
}
