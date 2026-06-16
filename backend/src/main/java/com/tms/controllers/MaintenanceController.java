package com.tms.controllers;

import com.tms.dto.MaintenanceRequest;
import com.tms.models.MaintenanceRecord;
import com.tms.services.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/maintenance")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceRecord>> getAllRecords() {
        return ResponseEntity.ok(maintenanceService.getAllRecords());
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<MaintenanceRecord>> getRecordsByBus(@PathVariable Long busId) {
        return ResponseEntity.ok(maintenanceService.getRecordsByBus(busId));
    }

    @PostMapping
    public ResponseEntity<?> logRecord(@Valid @RequestBody MaintenanceRequest request) {
        MaintenanceRecord record = maintenanceService.logRecord(request);
        return ResponseEntity.ok(record);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> markCompleted(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        LocalDate completionDate = LocalDate.parse(body.get("completionDate"));
        MaintenanceRecord record = maintenanceService.updateCompletionDate(id, completionDate);
        return ResponseEntity.ok(record);
    }
}
