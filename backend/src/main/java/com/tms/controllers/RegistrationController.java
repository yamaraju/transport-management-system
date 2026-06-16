package com.tms.controllers;

import com.tms.dto.RegistrationRequest;
import com.tms.models.Registration;
import com.tms.models.User;
import com.tms.services.AuthService;
import com.tms.services.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private AuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Registration>> getMyRegistrations() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(registrationService.getRegistrationsByUser(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.getRegistrationById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_STUDENT', 'ROLE_STAFF')")
    public ResponseEntity<?> createRegistration(@Valid @RequestBody RegistrationRequest regRequest) {
        User currentUser = authService.getCurrentUser();
        Registration registration = registrationService.createRegistration(currentUser, regRequest);
        return ResponseEntity.ok(registration);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateRegistrationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        Registration registration = registrationService.updateStatus(id, status);
        return ResponseEntity.ok(registration);
    }
}
