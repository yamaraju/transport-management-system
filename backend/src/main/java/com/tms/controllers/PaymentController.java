package com.tms.controllers;

import com.tms.dto.PaymentRequest;
import com.lowagie.text.DocumentException;
import com.tms.models.Payment;
import com.tms.models.Role;
import com.tms.models.User;
import com.tms.services.AuthService;
import com.tms.services.PaymentService;
import com.lowagie.text.DocumentException;
import com.tms.util.PdfGeneratorUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AuthService authService;

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('ROLE_STUDENT', 'ROLE_STAFF')")
    public ResponseEntity<?> makePayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        Payment payment = paymentService.processPayment(paymentRequest);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/payments/history")
    public ResponseEntity<List<Payment>> getPaymentHistory() {
        User currentUser = authService.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            return ResponseEntity.ok(paymentService.getAllPayments());
        } else {
            return ResponseEntity.ok(paymentService.getPaymentsByUser(currentUser.getId()));
        }
    }

    @GetMapping("/payments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/receipts/{paymentId}/download")
    public ResponseEntity<InputStreamResource> downloadReceipt(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        User currentUser = authService.getCurrentUser();

        if (currentUser.getRole() != Role.ROLE_ADMIN && 
            !payment.getRegistration().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        ByteArrayInputStream bis = PdfGeneratorUtils.generatePaymentReceipt(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=receipt_" + payment.getTransactionId() + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
