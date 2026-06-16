package com.tms.services;

import com.tms.dto.PaymentRequest;
import com.tms.exceptions.BadRequestException;
import com.tms.exceptions.ResourceNotFoundException;
import com.tms.models.Payment;
import com.tms.models.Registration;
import com.tms.repositories.PaymentRepository;
import com.tms.repositories.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
    }

    @Transactional
    public Payment processPayment(PaymentRequest paymentRequest) {
        Registration registration = registrationRepository.findById(paymentRequest.getRegistrationId())
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + paymentRequest.getRegistrationId()));

        if (!registration.getStatus().equals("APPROVED")) {
            throw new BadRequestException("Cannot make payment for a registration that is not APPROVED. Current status: " + registration.getStatus());
        }

        paymentRepository.findByRegistrationId(registration.getId()).ifPresent(p -> {
            if (p.getStatus().equals("SUCCESS")) {
                throw new BadRequestException("Payment has already been successfully made for this registration.");
            }
        });

        double requiredAmount = registration.getRoute().getFare();
        if (paymentRequest.getAmount() < requiredAmount) {
            throw new BadRequestException("Insufficient payment amount. Required: " + requiredAmount);
        }

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .registration(registration)
                .amount(paymentRequest.getAmount())
                .paymentDate(LocalDateTime.now())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .status("SUCCESS")
                .transactionId(transactionId)
                .build();

        return paymentRepository.save(payment);
    }

    public Double getTotalRevenue() {
        Double revenue = paymentRepository.sumTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    public long countPayments() {
        return paymentRepository.count();
    }
}
