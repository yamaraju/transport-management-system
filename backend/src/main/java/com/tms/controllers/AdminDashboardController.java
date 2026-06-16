package com.tms.controllers;

import com.tms.models.Role;
import com.tms.services.AuthService;
import com.tms.services.BusService;
import com.tms.services.PaymentService;
import com.tms.services.RegistrationService;
import com.tms.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminDashboardController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RouteService routeService;

    @Autowired
    private BusService busService;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", authService.countUsersByRole(Role.ROLE_STUDENT));
        stats.put("totalStaff", authService.countUsersByRole(Role.ROLE_STAFF));
        stats.put("totalRoutes", routeService.countRoutes());
        stats.put("totalBuses", busService.countBuses());
        stats.put("totalRegistrations", registrationService.countRegistrations());
        stats.put("totalRevenue", paymentService.getTotalRevenue());
        return ResponseEntity.ok(stats);
    }
}
